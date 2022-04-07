const express = require('express');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const Comment = mongoose.model('Comment');


const createComment = (req, res) => {
    const userId = req.user
    const newComment = new Comment({ userId: userId, ...req.body});
    newComment.save((err, comment) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(201).json(comment);
    });
}

const deleteComment = (req, res) => {
    Comment.findOneAndRemove({ userId: req.user, _id: req.params.comment_id }, (err, comment) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(comment);
    });
}

const updateComment = (req, res) => {
    Comment.findOneAndUpdate({ userId: req.user, _id: req.params.comment_id }, req.body, (err, comment) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(comment);
    });
}

const verifyComment = (req, res) => {
    Comment.findOneAndUpdate({ userId: req.user, _id: req.params.comment_id }, { isVerified: true }, (err, comment) => {
        if (err) {
            res.status(500).send(err);
        } else {
            Question.findOneAndUpdate({ _id: comment.questionId }, { isVerified: true }, (err, question) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).json({"message": "Comment verified"});
            });
        }
    });
}


module.exports = {
    createComment,
    deleteComment,
    updateComment,
    verifyComment
}