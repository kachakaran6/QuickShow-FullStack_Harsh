import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';
import Show from './models/Show.js';

dotenv.config();

const cleanup = async () => {
    try {
        // Use the correct database name 'movieswift'
        const uri = `${process.env.MONGODB_URI}/movieswift`;
        console.log(`Connecting to: ${uri}`);
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for cleanup...");

        // 1. First, find all movies that are "Fallback"
        const fallbackMovies = await Movie.find({
            $or: [
                { title: /Fallback Movie/i },
                { overview: /Fallback overview/i },
                { tagline: /API Blocked/i }
            ]
        });
        
        const fallbackIds = fallbackMovies.map(m => m._id);
        console.log(`Found ${fallbackIds.length} fallback movies:`, fallbackIds);

        // 2. Delete all shows that reference these fallback movies
        const showDeleteResult = await Show.deleteMany({
            movie: { $in: fallbackIds }
        });
        console.log(`Deleted ${showDeleteResult.deletedCount} shows referencing fallback movies.`);

        // 3. Delete the fallback movies themselves
        const movieDeleteResult = await Movie.deleteMany({
            _id: { $in: fallbackIds }
        });
        console.log(`Deleted ${movieDeleteResult.deletedCount} fallback movie records.`);

        // 4. Identify and remove duplicate shows (same movie and same time)
        const duplicates = await Show.aggregate([
            {
                $group: {
                    _id: { movie: "$movie", showDateTime: "$showDateTime" },
                    count: { $sum: 1 },
                    docs: { $push: "$_id" }
                }
            },
            {
                $match: { count: { $gt: 1 } }
            }
        ]);

        console.log(`Found ${duplicates.length} sets of duplicate show entries.`);

        let deletedDuplicateCount = 0;
        for (const duplicate of duplicates) {
            const [keep, ...remove] = duplicate.docs;
            const res = await Show.deleteMany({ _id: { $in: remove } });
            deletedDuplicateCount += res.deletedCount;
        }
        console.log(`Deleted ${deletedDuplicateCount} duplicate show documents.`);

        console.log("Cleanup complete!");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
};

cleanup();
