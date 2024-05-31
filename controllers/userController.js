import mongoose from "mongoose";
import passwordmanager from "../schema/userSchema.js";
import { sendOTP } from '../util/nodemailer.js';

const userController = {};

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Function to generate OTP and send it to the user's email

userController.generateAndSendOTP = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the request body for debugging
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await passwordmanager.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate OTP (you can use any OTP generation library)
        const otp = generateOTP();

        // Save OTP to user document
        user.otp = otp;
        await user.save();

        // Send OTP to user's email
        await sendOTP(user.email, otp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error generating and sending OTP:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Step 5: Modify Authentication Endpoint
userController.authenticate = async (req, res) => {
    try {
        const { email, password, otp } = req.body;
        console.log('Authenticate request body:', req.body.email);

        
        const user = await passwordmanager.findOne({ email });
        console.log('User found:', user);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (otp) {
            if (user.otp !== otp) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            // Clear OTP after successful login
            user.otp = '';
            await user.save();
        } 
   

        // Proceed with login
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error during authentication:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// userController.authenticate = (req, res) => {
//     passwordmanager.findOne({username: req.body.username})
//         .then(usr => {
//             if(!usr) {
//                 res.status(400).send({message: 'user not found!'});
//             } else if(usr.password !== req.body.password) {
//                 res.status(400).send({message: 'password is invalid'});
//             } else {
//                 res.status(200).json(usr);
//             }
//         }).catch(err => {
//             console.log(err);
//             console.log("validation failed!");
//         })
// }; 

userController.checkIfUserExists = (req,res) => {
    passwordmanager.findOne({email: req.body.email})
    .then(usr => {
        if(!usr) {
            res.status(404).send({message: 'user not found!'});
        }else {
            res.status(200).json(usr.user);
        }
    }).catch(err => {
        console.log(err);
        console.log("Error occured while finding user");
        res.status(500).send({message: 'Error occured while finding user'});
    })
}

userController.addUserDetails = (req,res) => {
     const newUser = new passwordmanager({
        username: req.body.username,
        email:req.body.email,
        password: req.body.password     
     });
     newUser.save().then(usr => {
        if(!usr){
            console.log("Error: User not saved.");
            res.status(500).send({message: "Error while saving user data"})
        }else {
            console.log("User saved successfully:", usr);
            res.status(200).send({user:usr})
        }
     }).catch(err => {
        console.log(err);
        res.status(500).send({message: "Error while saving user data"})
    })
}

userController.addApp = (req, res) => {
    console.log('addApp request body:', req.body); 
    if (!req.body.email || !req.body.app) {
        console.log('Email or app data missing');
        return res.status(400).send({ message: 'Email and app data are required' });
    }
    passwordmanager.findOneAndUpdate({ email: req.body.email }, { $push: { apps: req.body.app } }, { new: true })
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
    passwordmanager.findOneAndUpdate({ email: req.body.email }, { $pull: { apps: { name: req.body.appName } } }, { returnDocument: 'after' })
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