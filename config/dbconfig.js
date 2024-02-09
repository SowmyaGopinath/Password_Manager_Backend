import mongoose, { mongo } from 'mongoose';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL + "/" + process.env.DATABASE;

mongoose.connect(dbUrl).catch(error => {
    console.log("failed to initial db connection " + dbUrl);
});

const conn = mongoose.connection;

conn.on("connected", () => {
    console.log("MongoDb connection successfull " );
})

conn.on("disconnected", () => {
    console.log(" db connection disconnected!");
})

conn.on('error', (err) => {
    console.log("MongoDb connection error: " + err);
})

process.on('SIGINT', () => {
    mongoose.disconnect();
    console.log("MongoDb connections closed!");
    process.exit(0); 
});

export default mongoose;