const express = require('express');
var router = express.Router();
const { 
    createUser, 
    handleLogin, 
    handleLogout,
    handleRefreshToken,
    getUser,
    getUsers,
    updateUserInformations,
    UpdateUserProfilePicture
} = require('../controllers/UserController');
const {
    uploadProfilePicture
  } = require("../config/upload");
  
const isAuthenticated = require('../middlewares/isAuthenticated');


router.post('/register', createUser);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);
router.post('/refresh', handleRefreshToken)
router.get('/user/:id', getUser);
router.get('/users', getUsers);
router.put('/updateuser', isAuthenticated, updateUserInformations);
router.post('/uploadprofilepicture', isAuthenticated,     uploadProfilePicture.single('picture'),UpdateUserProfilePicture);
router.get('/test', isAuthenticated, (req, res) => {
    res.send({"Message": "Authenticated and able to see this"})
})

module.exports = { router };