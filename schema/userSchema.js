import mongoose from "../config/dbconfig.js";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    apps: [
        {
            name: String,
            password: String,
            icon: String
            // metadata: Map
        }
    ]
}, {collection: 'passwordmanager'});

const passwordmanager = mongoose.model('passwordmanager',userSchema);

export default passwordmanager;