import mongoose from "mongoose";
import user from "../schema/userSchema.js";

const userController = {};

userController.authenticate = (req, res) => {
    user.findOne({username: req.body.username})
        .then(usr => {
            if(!usr) {
                res.status(400).send({message: 'user not found!'});
            } else if(usr.password !== req.body.password) {
                res.status(400).send({message: 'password is invalid'});
            } else {
                res.status(200).json(usr);
            }
        }).catch(err => {
            console.log(err);
            console.log("validation failed!");
        })
}; 

userController.checkIfUserExists = (req,res) => {
    user.findOne({username: req.body.username})
    .then(usr => {
        if(!usr) {
            res.status(404).send({message: 'user not found!'});
        }else {
            res.status(200).json(usr);
        }
    }).catch(err => {
        console.log(err);
        console.log("Error occured while finding user");
        res.status(500).send({message: 'Error occured while finding user'});
    })
}

userController.addUserDetails = (req,res) => {
     const newUser = new user({
        username: req.body.username,
        password: req.body.password
     });
     newUser.save().then(usr => {
        if(!usr){
            res.status(500).send({message: "Error while saving user data"})
        }else {
            res.status(200).send({message: "Successfully saved User details"})
        }
     }).catch(err => {
        console.log(err);
        res.status(500).send({message: "Error while saving user data"})
    })
}

userController.addApp = (req, res) => {
    user.findOneAndUpdate({username: req.body.username}, {$push: {apps: req.body.app}}, {new: true})
        .then(updatedUser => {
            if(updatedUser) {
                console.dir(updatedUser);
                res.status(200).json(updatedUser);
            } else {
                console.log("user not found!");
                res.status(400).send({message: "user not found!"});
            }
        }).catch(e => {
            console.log("Failed to update the user. Error occurred " + e);
            res.status(500).send({message: "Internal server error. Failed to update the user"});
        })
}

userController.deleteApp = (req, res) => {
    user.findOneAndUpdate({username: req.body.username}, {$pull: {apps: {name:req.body.appName}}}, {returnDocument: 'after'})
        .then(updatedUser => {
            if(updatedUser) {
                console.dir(updatedUser);
                res.status(200).json(updatedUser);
            } else {
                console.log("user not found!");
                res.status(400).send({message: "user not found!"});
            }
        }).catch(e => {
            console.log("Failed to update the user. Error occurred " + e);
            res.status(500).send({message: "Internal server error. Failed to update the user"});
        })
}



export default userController;