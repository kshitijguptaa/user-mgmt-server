const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const { update } = require('lodash');
const { use } = require('../routes/index.router');
const e = require('express');
const multer = require('multer');
var DIR = './uploads/';
var upload = multer({dest: DIR}).single('photo');
const User = mongoose.model('User');
const UserFriend = mongoose.model('userFriends');
// const data = require('../uploads')

module.exports.register = (req, res, next) => {
    if (req.body.isLocalLogin === true) {
       var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.city = req.body.city ? req.body.city : ""
    user.state = req.body.state ? req.body.state : ""
    user.country =  req.body.country ? req.body.country : ""
    user.isLocalLogin = req.body.isLocalLogin
    user.profilePic = ""
    user.save((err, doc) => {
        if (!err) {
        var userFriend = new UserFriend();
        userFriend.fullName = req.body.fullName
        userFriend.userReferenceId = (doc._id).valueOf()
        userFriend.friendList = []
        userFriend.friendRequest = []
        userFriend.requestSent = []
        userFriend.save((err, docs)=>{
        return res.status(200).json({ status: true, message: 'Registration Successfull' });

        })
    }
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });  
    } else {
        var user = new User();
        user.fullName = req.body.gt.Ue;
        user.email = req.body.gt.Rt;
        user.password = req.body.gt.GS
        user.city = ""
        user.state = ""
        user.country =  ""
        user.isLocalLogin = req.body.isLocalLogin
        user.profilePic = req.body.gt.zJ ? req.body.gt.zJ : ""
        user.save((err, doc) => {
            if (!err) {
            var userFriend = new UserFriend();
            userFriend.fullName = req.body.gt.Ue
            userFriend.userReferenceId = (doc._id).valueOf()
            userFriend.friendList = []
            userFriend.friendRequest = []
            userFriend.requestSent = []
            userFriend.save((err, docs)=>{
                return res.status(200).json({ status: true, message: 'Registration Successfull' });
            })
        }
            else {
                if (err.code == 11000)
                    res.status(422).send(['Duplicate email adrress found.']);
                else
                    return next(err);
            }
    
        });  
    }
   
    
    
}
module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}
module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user });
        }
    );
}
module.exports.updateUserProfile = (req,res,next) => {
    User.findByIdAndUpdate(req._id , req.body, function (err, update) {
        if(!update)
        return res.status(202).json({ status: false, message: 'User record not found.' });
        else
        return res.status(200).json({ status: true, update : _.pick(update,['fullName','email', 'city', 'state', 'country']) });
      });
}

