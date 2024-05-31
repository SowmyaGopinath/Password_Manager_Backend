import mongoose from "../config/dbconfig.js";


const appSchema = new mongoose.Schema({
    name: String,
    email:String,
    password: String,
    icon: String,
    // Add additional fields like created date, last modified date if needed
});

const userSchema = new mongoose.Schema({
    username: String,
    email:String,
    password: String,
    otp: String,
    apps: [appSchema]
}, { collection: 'passwordmanager' });

const passwordmanager = mongoose.model('passwordmanager', userSchema);

export default passwordmanager;



// // Step 5: Modify Authentication Endpoint
// userController.authenticate = async (req, res) => {
//     try {
//         const { username, password, otp } = req.body;
//         const user = await passwordmanager.findOne({ username });

//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }

//         if (user.password !== password) {
//             return res.status(400).json({ message: 'Invalid password' });
//         }

//         if (user.otp !== otp) {
//             return res.status(400).json({ message: 'Invalid OTP' });
//         }

//         // Clear OTP after successful login
//         user.otp = '';
//         await user.save();

//         // Proceed with login
//         res.status(200).json({ message: 'Login successful', user });
//     } catch (error) {
//         console.error('Error during authentication:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
    
//     apps: [
//         {
//             name: String,
//             password: String,
//             icon: String
//             // metadata: Map
//         }
//     ]
// }, {collection: 'passwordmanager'});

// const passwordmanager = mongoose.model('passwordmanager',userSchema);

// export default passwordmanager;