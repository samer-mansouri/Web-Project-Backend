const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  upload,
  fileFilter,
  storage,
} = require("../config/upload");


const { validateUser, initializeUser } = require('../helpers/UserHelpers')


let createUser = async (req, res) =>{
    console.log(req.body)
    const { error } = validateUser(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      }
    );
    if(error){
      console.log(here)
      console.log(error)
      //console.log(error);
      //console.log(error.message)
      res.status(400).send({"Error" : error.message})
    } else {
      let user = await User.findOne({ email:  req.body.email });
      if (user){
        res.status().status(409).send({'message': 'User with this email already exists ! '});
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        initializeUser(
          req.body.firstName,
           req.body.lastName,
           req.body.dateOfBirth,
           req.body.picture,
           req.body.email,
           req.body.gender,
           hash)
        .save((err, doc) => {
          if(!err){
            res.status(201).send({'message': 'User created with success !'});
          } else {
            console.log(err);
            res.status(500).send({"Error": "Internal Server Error"})
          }
        });
      }
    }
  
}

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id })
  .populate('garage')
  .exec();
  if(!user){
    res.status(404).send({'message': 'User not found !'});
  } else {
    res.status(200).send(user);
  }
}

const getUsers = async (req, res) => {
  const users = await User.find({})
  .populate('garage')
  .exec();
  if(!users){
    res.status(404).send({'message': 'Users not found !'});
  } else {
    res.status(200).send(users);
  }
}



const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

  const foundUser = await User.findOne({ email: email }).exec();
  console.log(foundUser)
  if (!foundUser) return res.sendStatus(401).send({"Error": "User not found"}); //Unauthorized 
  // evaluate password 
  else {
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "user_id": foundUser._id,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '180s' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        res.json({ refreshToken, accessToken, currentUser: foundUser._id });
    } else {
        res.status(401).send({"Error": "Wrong password"});
    }
  }
  
}

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(204); //No content

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
      return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.sendStatus(204);
}

const handleRefreshToken = async (req, res) => {
  console.log(req.body.refreshToken);
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden 
  // evaluate jwt 
  jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
          if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
          const accessToken = jwt.sign(
              {
                "UserInfo": {
                  "email": foundUser.email,
                  "user_id": foundUser._id,
                }
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '180s' }
          );
          res.json({ accessToken })
      }
  );
}


const updateUserInformations = (req, res) => {
  User.findOneAndUpdate({ _id: req.user }, req.body, { new: true }, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log('Error in User Update :' + JSON.stringify(err, undefined, 2));
    }
  });
}


const UpdateUserProfilePicture  = (req, res) => {

    User.findOneAndUpdate({_id: req.user}, {picture: req.file.path}, (err, doc) => {
        if(!err){
            res.status(201).send(doc);
        } else {
            console.log('Error in User Update :' + JSON.stringify(err, undefined, 2));
            res.status(400).send({"Error": "Internal Server Error"})
        }
    });
}

  
module.exports = {
  createUser,
  handleLogin,
  handleLogout,
  handleRefreshToken,
  getUser,
  getUsers,
  updateUserInformations,
  UpdateUserProfilePicture,
};