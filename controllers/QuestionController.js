const express = require('express');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');

const getAllQuestions = (req, res) => {
    Question.find({})
    .populate("user", "firstName lastName picture")
    .populate("commentsNumber")
    .exec((err, questions) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(questions);
    });
};

const getSingleQuestion = (req, res) => {
    Question.findById(req.params.question_id)
    .populate("user", "firstName lastName picture")
    .populate({
        path:"comments"
        , populate: {
            path: "user",
            model: "User"
        }
    })
    .exec((err, question) => {
        if (err) {
        res.status(500).send({"Error" : "Something went wrong"});
        }
        res.status(200).json(question);
    });
}

const getUserQuestions = (req, res) => {
    Question.find({user: req.params.user_id}, (err, questions) => {
        if (err) {
         res.status(500).send(err);
        }
        res.status(200).json(questions);
    });
}

const createQuestion = (req, res) => {
    const userId = req.user
    console.log("Here is the userId: " + userId)
    const newQuestion = new Question({ userId: userId, ...req.body});
    console.log("Here")
    newQuestion.save((err, question) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(201).json(question);
    });
}

const updateQuestion = (req, res) => {
    Question.findOneAndUpdate({ userId: req.user, _id: req.params.question_id }, req.body, { new: true }, (err, question) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(question);
    });
}

const deleteQuestion = (req, res) => {
    Question.remove({ userId: req.user, _id: req.params.question_id }, (err, question) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json({ message: 'Successfully deleted question!' });
    });
}

module.exports = {
    getAllQuestions,
    getSingleQuestion,
    getUserQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion
}