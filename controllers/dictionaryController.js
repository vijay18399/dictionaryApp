const Word = require('../models/Word');
const WordInfo = require('../models/WordInfo');
const Example = require('../models/Example');
const CEFR = require('../models/CEFR');
const sequelize = require('../db');
const { Op } = require('sequelize');

/**
 * @swagger
 * /recommendations/{word}:
 *   get:
 *     summary: Get word recommendations starting with a given word
 *     parameters:
 *       - in: path
 *         name: word
 *         required: true
 *         description: The word prefix to search for recommendations.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of word recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: No recommendations found
 *       500:
 *         description: Internal server error
 */
exports.getRecommendations = async (req, res) => {
    const word = req.params.word.toLowerCase();
    try {      
        const wordData = await Word.findAll(
            {
                where: { 
                    word: {
                        [Op.like]: `${word}%` 
                    }
                },
            }
        );
        res.json(wordData.map((word)=> word.Word));
    } catch (error) {
        console.error('Error fetching recommendations:', error); 
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /wordInfo/{word}:
 *   get:
 *     summary: Get detailed information for a specific word
 *     parameters:
 *       - in: path
 *         name: word
 *         required: true
 *         description: The word to get details for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed information about the word
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 word:
 *                   type: string
 *                 partsOfSpeech:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       partOfSpeech:
 *                         type: string
 *                       definition:
 *                         type: string
 *                 examples:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Word not found
 *       500:
 *         description: Internal server error
 */
exports.getWordDetails = async (req, res) => {
    const word = req.params.word.toLowerCase();
    try {
        const wordData = await Word.findOne({
            where: { 
                word: {
                    [Op.like]: `${word}%` 
                }
            },
            include: [
                { model: WordInfo, attributes: ['partOfSpeech', 'definition'] },
                { model: CEFR, attributes: ['Level','Voice','Phonetics'] },
                { model: Example, attributes: ['example'] }
            ]
        });

        if (!wordData) {
            return res.status(404).json({ message: `Word not found: ${word}` });
        }
        
        const wordDetails = {
            word: wordData.Word, 
            partsOfSpeech: wordData.WordInfos.map((info) => ({
                partOfSpeech: info.partOfSpeech,
                definition: info.definition,
            })),
            examples: wordData.Examples.length > 0
                ? wordData.Examples.map((ex) => ex.example)
                : [],
            CEFR: wordData.CEFR ? {
                Level: wordData.CEFR.Level,
                Phonetics: wordData.CEFR.Phonetics,
                Voice: wordData.CEFR.Voice,
            } : null,
        };

        res.json(wordDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * @swagger
 * /randomWord:
 *   get:
 *     summary: Get a randomWord
 *     responses:
 *       200:
 *         description: A randomWord with its details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 word:
 *                   type: string
 *                 partsOfSpeech:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       partOfSpeech:
 *                         type: string
 *                       definition:
 *                         type: string
 *       404:
 *         description: No word found 
 *       500:
 *         description: Internal server error
 */
exports.randomWord = async (req, res) => {
    try {
        const wordData = await Word.findOne({
            order: sequelize.random(), 
            include: [
                { model: WordInfo, attributes: ['partOfSpeech', 'definition'] },
                { model: CEFR, attributes: ['Level','Voice','Phonetics'] } 
            ]
        });

        if (!wordData) {
            return res.status(404).json({ message: 'Unable to generate random Word' });
        }
        const wordDetails = {
            word: wordData.Word,
            partsOfSpeech: wordData.WordInfos.map(info => ({
                partOfSpeech: info.partOfSpeech,
                definition: info.definition
            })),
        };
        if(wordData.CEFR) {
            wordDetails.CEFR = {
                Level: wordData.CEFR.Level,
                Phonetics: wordData.CEFR.Phonetics,
                Voice: wordData.CEFR.Voice,
            };
        }
        res.json(wordDetails);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: error.message });
    }
};

