const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./dictionary.db'); 

/**
 * Get word recommendations starting with a given word using plain SQLite query
 */
exports.getRecommendations = (req, res) => {
    const word = req.params.word.toLowerCase();

    const query = `SELECT word FROM words WHERE word LIKE ?`;
    const queryParams = [`${word}%`];

    db.all(query, queryParams, (err, rows) => {
        if (err) {
            console.error('Error fetching recommendations:', err);
            return res.status(500).json({ error: err.message });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No recommendations found' });
        }

        const words = rows.map(row => row.word);
        res.json(words);
    });
};

/**
 * Get detailed information for a specific word using plain SQLite query
 */
exports.getWordDetails = (req, res) => {
    const word = req.params.word.toLowerCase();

    const query = `
        SELECT 
            w.word, 
            wi.pos, 
            wi.definition, 
            e.example,
            c.level, 
            c.phonetics, 
            c.voice
        FROM words w
        LEFT JOIN word_info wi ON w.id = wi.wordId
        LEFT JOIN examples e ON w.id = e.wordId
        LEFT JOIN cefr c ON w.id = c.wordId
        WHERE LOWER(w.word) = ?
    `;
    const queryParams = [word];

    db.all(query, queryParams, (err, rows) => {
        if (err) {
            console.error('Error fetching word details:', err);
            return res.status(500).json({ error: err.message });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: `Word not found: ${word}` });
        }

        const posDefinitionsMap = new Map();
        const examples = new Set();

        rows.forEach(row => {
            // Grouping pos and definition
            if (row.pos && row.definition) {
                const key = `${row.pos}|${row.definition}`; // Create a unique key for each pos-definition pair
                if (!posDefinitionsMap.has(key)) {
                    posDefinitionsMap.set(key, { pos: row.pos, definition: row.definition });
                }
            }
            // Collecting examples
            if (row.example) {
                examples.add(row.example); // Using Set to avoid duplicates
            }
        });

        // Convert Map values to an array
        const posDefinitions = Array.from(posDefinitionsMap.values());

        const wordDetails = {
            word: rows[0].word,
            pos: posDefinitions,
            examples: Array.from(examples), // Convert Set back to array
            cefr: rows[0].level ? {
                level: rows[0].level,
                phonetics: rows[0].phonetics,
                voice: rows[0].voice,
            } : null
        };

        res.json(wordDetails);
    });
};

/**
 * Get a wordOfTheDay with its details using plain SQLite query
 */
exports.wordOfTheDay = (req, res) => {
    // Check if a specific date is provided; use today if not
    const givenDate = req.query.date ? req.query.date : 'now';

    // Define the query to select a word based on the given or current day
    const query = `
        SELECT word, pos, definition, level, phonetics, voice
        FROM (
            SELECT w.word, wi.pos, wi.definition, c.level, c.phonetics, c.voice,
                   ROW_NUMBER() OVER (ORDER BY LENGTH(w.word)) AS rn
            FROM words w
            JOIN word_info wi ON w.id = wi.wordId
            JOIN cefr c ON w.id = c.wordId  
            WHERE LENGTH(w.word) > 5   
            GROUP BY w.word
        ) AS subquery
        WHERE rn = (
                      (JULIANDAY(?) - JULIANDAY('2024-01-01'))
                      % (
                         SELECT COUNT(DISTINCT w.word) FROM words w
                         JOIN word_info wi ON w.id = wi.wordId
                         JOIN cefr c ON w.id = c.wordId 
                         WHERE LENGTH(w.word) > 5
                        GROUP BY w.word

                      )
                   ) + 1;
    `;

    // Execute the query with the date parameter
    db.get(query, [givenDate], (err, row) => {
        if (err) {
            console.error('Error fetching Word of the Day:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!row) {
            return res.status(404).json({ message: 'Unable to generate Word of the Day' });
        }

        // Structure the response in the desired format
        const wordDetails = {
            word: row.word,
            pos: [{
                pos: row.pos,
                definition: row.definition
            }],
            CEFR: row.level ? {
                level: row.level,
                phonetics: row.phonetics,
                voice: row.voice,
            } : null
        };

        res.json(wordDetails);
    });
};







/**
 * Get a random word with its details using plain SQLite query
 */
exports.randomWord = (req, res) => {
    let queryParams = [];
    let query = `
            SELECT w.word, wi.pos, wi.definition, c.level, c.phonetics, c.voice
            FROM words w
            JOIN word_info wi ON w.id = wi.wordId
            JOIN cefr c ON w.id = c.wordId
            ORDER BY RANDOM() LIMIT 1
        `;
    db.get(query, queryParams, (err, row) => {
        if (err) {
            console.error('Error fetching random word:', err);
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ message: 'Unable to generate random Word' });
        }

        const wordDetails = {
            word: row.word,
            pos: [{
                pos: row.pos,
                definition: row.definition
            }],
            CEFR: row.level ? {
                level: row.level,
                phonetics: row.phonetics,
                voice: row.voice,
            } : null
        };

        res.json(wordDetails);
    });
};

/**
 * Get CEFR words by specified level with pagination, including unique words, voice, and phonetic
 */
exports.getCEFRWordsByLevel = (req, res) => {
    const level = req.query.level; // Get the level from the request parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 words per page

    const offset = (page - 1) * pageSize;

    const countQuery = `
        SELECT COUNT(DISTINCT w.word) as totalWords
        FROM words w
        JOIN cefr c ON w.id = c.wordId
        WHERE c.level = ?
    `;

    const dataQuery = `
        SELECT DISTINCT w.word, c.voice, c.phonetics
        FROM words w
        JOIN cefr c ON w.id = c.wordId
        WHERE c.level = ?
        ORDER BY w.word
        LIMIT ? OFFSET ?
    `;

    // First, fetch the total unique word count for the specified level
    db.get(countQuery, [level], (countErr, countResult) => {
        if (countErr) {
            console.error('Error fetching word count:', countErr);
            return res.status(500).json({ error: countErr.message });
        }

        const totalWords = countResult.totalWords;
        if (totalWords === 0) {
            return res.status(404).json({ message: `No words found for level ${level}` });
        }

        // Then, fetch the paginated unique words with voice and phonetic details
        db.all(dataQuery, [level, pageSize, offset], (dataErr, rows) => {
            if (dataErr) {
                console.error('Error fetching CEFR words:', dataErr);
                return res.status(500).json({ error: dataErr.message });
            }

            const words = rows.map(row => ({
                word: row.word,
                voice: row.voice,
                phonetics: row.phonetics
            }));

            res.json({ level, words, totalWords, page, totalPages: Math.ceil(totalWords / pageSize) });
        });
    });
};
/**
 * Get CEFR words by specified levels (comma-separated) with a limit, including word meanings
 */
exports.getCEFRWordsByLevels = (req, res) => {
    const levels = req.query.levels; 

    if (!levels) {
        return res.status(400).json({ error: 'Levels parameter is required' });
    }

    const levelArray = levels.split(',').map(level => level.trim());
    
    const placeholders = levelArray.map(() => '?').join(', ');
    let query = `
        SELECT DISTINCT w.word, wi.definition, c.voice, c.phonetics
        FROM words w
        JOIN cefr c ON w.id = c.wordId
        LEFT JOIN word_info wi ON w.id = wi.wordId
        WHERE c.voice IS NOT NULL AND c.level IN (${placeholders})
    `;

    // Check if limit is provided
    const limit = parseInt(req.query.limit); // No default, will handle if undefined

    // If limit is specified, add it to the query
    if (!isNaN(limit) && limit > 0) {
        query += ` ORDER BY RANDOM() LIMIT ?`;
    } else {
        query += ` ORDER BY RANDOM()`; // Just order randomly if no limit
    }

    const queryParams = [...levelArray];

    // Add limit to queryParams if it's defined
    if (!isNaN(limit) && limit > 0) {
        queryParams.push(limit);
    }

    db.all(query, queryParams, (err, rows) => {
        if (err) {
            console.error('Error fetching CEFR words:', err);
            return res.status(500).json({ error: err.message });
        }

        const words = rows.map(row => ({
            word: row.word,
            definition: row.definition,
            voice: row.voice,
            phonetics: row.phonetics
        }));

        res.json({ levels: levelArray, words });
    });
};




