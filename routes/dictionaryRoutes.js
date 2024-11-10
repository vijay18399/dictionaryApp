const express = require('express');
const router = express.Router();
const dictionaryController = require('../controllers/dictionaryController');

router.get('/wordInfo/:word', dictionaryController.getWordDetails);
router.get('/recommendations/:word', dictionaryController.getRecommendations);
router.get('/random', dictionaryController.randomWord);
router.get('/wordOftheDay', dictionaryController.wordOfTheDay);
router.get('/cefr', dictionaryController.getCEFRWordsByLevel);
router.get('/cefr-words', dictionaryController.getCEFRWordsByLevels);



module.exports = router;
