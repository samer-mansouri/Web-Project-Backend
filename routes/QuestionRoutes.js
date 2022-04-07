const express = require('express');
var router = express.Router();
const { 
    createQuestion,
    getAllQuestions,
    getSingleQuestion,
    getUserQuestions,
    updateQuestion,
} = require('../controllers/QuestionController');
const {
    uploadQuestionPictures
} = require("../config/upload");
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/questions', isAuthenticated, getAllQuestions);
router.get('/question/:question_id', isAuthenticated, getSingleQuestion);
router.get('/question/:user_id/questions', isAuthenticated, getUserQuestions);
router.put('/question/:question_id', isAuthenticated, updateQuestion);
router.post('/question', isAuthenticated,  uploadQuestionPictures.fields([{ name: 'photos', maxCount: 6 }]), createQuestion);


module.exports = { router };