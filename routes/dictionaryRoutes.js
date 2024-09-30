const express = require('express');
const router = express.Router();
const dictionaryController = require('../controllers/dictionaryController');

/**
 * @swagger
 * tags:
 *   - name: Dictionary
 *     description: Dictionary related API's
 */

/**
 * @swagger
 * /wordInfo/{word}:
 *   get:
 *     tags: [Dictionary]
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
 *       404:
 *         description: Word not found
 *       500:
 *         description: Internal server error
 */
router.get('/wordInfo/:word', dictionaryController.getWordDetails);

/**
 * @swagger
 * /recommendations/{word}:
 *   get:
 *     tags: [Dictionary]
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
 *       404:
 *         description: No recommendations found
 *       500:
 *         description: Internal server error
 */
router.get('/recommendations/:word', dictionaryController.getRecommendations);

/**
 * @swagger
 * /random:
 *   get:
 *     tags: [Dictionary]
 *     summary: Get a random word 
 *     responses:
 *       200:
 *         description: A random word  with its details
 *       404:
 *         description: No word found  
 *       500:
 *         description: Internal server error
 */
router.get('/random', dictionaryController.randomWord);

module.exports = router;
