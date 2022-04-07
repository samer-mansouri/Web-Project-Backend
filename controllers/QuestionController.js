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

const getAllQuestionsWithPagination = (req, res) => {
    var options = {
        sort : { createdAt: -1 },
        page : req.query.page || 1,
        limit : 10,
        lean : true,
        populate : [
                {
                    path: "user",
                    select: "firstName lastName picture",
                    model: "User"
                },
                {
                    path: "commentsNumber",
                }
        ],
    }
    Question.paginate({}, options, (err, questions) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(questions);
    });
}

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
    console.log(req.files);
    const userId = req.user
    if(req.files.photos){
        const images = [];
        req.files.photos.forEach(file => {
            images.push(file.path);
        });
        const newQuestion = new Question({ userId: userId, pictures: images,...req.body});
        newQuestion.save((err, question) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(201).json(question);
        });
    } else {
        const newQuestion = new Question({ userId: userId, ...req.body});
        newQuestion.save((err, question) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(201).json(question);
        });
    }
    
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
    deleteQuestion,
    getAllQuestionsWithPagination
}