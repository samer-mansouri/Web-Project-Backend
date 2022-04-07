const express = require('express');
var router = express.Router();
const { 
    createQuestion,
    getAllQuestions,
    getSingleQuestion,
    getUserQuestions,
    updateQuestion,
} = require('../controllers/QuestionController');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/questions', isAuthenticated, getAllQuestions);
router.get('/question/:question_id', isAuthenticated, getSingleQuestion);
router.get('/question/:user_id/questions', isAuthenticated, getUserQuestions);
router.put('/question/:question_id', isAuthenticated, updateQuestion);
router.post('/question', isAuthenticated, createQuestion);


module.exports = { router };