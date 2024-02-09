import {MongoClient} from 'mongodb';

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('testdb');
        const passwordmanager = database.collection('passwordmanager');
        const query = {username: 'user1'};
        const user = await passwordmanager.findOne(query);
        console.log(user);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);


