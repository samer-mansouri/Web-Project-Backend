const express = require('express');
var router = express.Router();
const { 
    createComment,
    deleteComment,
    updateComment,
    verifyComment,
} = require('../controllers/CommentController');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/comment/create', isAuthenticated, createComment);
router.delete('/comment/delete/:comment_id', isAuthenticated, deleteComment);
router.put('/comment/update/:comment_id', isAuthenticated, updateComment);
router.put('/comment/verify/:comment_id', isAuthenticated, verifyComment);

module.exports = { router };