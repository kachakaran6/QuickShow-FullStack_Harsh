import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkDBs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const dbs = await admin.listDatabases();
        console.log("Databases List:", JSON.stringify(dbs.databases.map(d => d.name), null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDBs();
