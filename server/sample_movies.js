import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const listMovies = async () => {
    try {
        const uri = `${process.env.MONGODB_URI}/movieswift`;
        await mongoose.connect(uri);
        const movies = await Movie.find({}).limit(10);
        console.log("Current Data Sample:", JSON.stringify(movies.map(m => ({ id: m._id, title: m.title })), null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listMovies();
