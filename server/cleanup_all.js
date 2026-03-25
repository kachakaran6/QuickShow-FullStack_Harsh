import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';
import Show from './models/Show.js';

dotenv.config();

const cleanDB = async (dbName) => {
    try {
        const uri = `${process.env.MONGODB_URI}/${dbName}`;
        console.log(`\n--- Cleaning Database: ${dbName} ---`);
        await mongoose.disconnect();
        await mongoose.connect(uri);
        console.log(`Connected to MongoDB: ${dbName}`);

        // 1. Find all "Fallback" movies
        const fallbackMovies = await Movie.find({
            $or: [
                { title: /Fallback Movie/i },
                { overview: /Fallback overview/i },
                { tagline: /API Blocked/i }
            ]
        });
        
        const fallbackIds = fallbackMovies.map(m => m._id);
        if (fallbackIds.length > 0) {
            console.log(`Found ${fallbackIds.length} fallback movie IDs:`, fallbackIds);

            // 2. Delete shows referencing them
            const showDeleteRes = await Show.deleteMany({
                movie: { $in: fallbackIds }
            });
            console.log(`Deleted ${showDeleteRes.deletedCount} shows for fallback movies.`);

            // 3. Delete movie records
            const movieDeleteRes = await Movie.deleteMany({
                _id: { $in: fallbackIds }
            });
            console.log(`Deleted ${movieDeleteRes.deletedCount} fallback movies.`);
        } else {
            console.log("No fallback movies found in this DB.");
        }

        // 4. Remove duplicate shows (independently)
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

        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} duplicate show sets.`);
            let deletedCount = 0;
            for (const duplicate of duplicates) {
                const [keep, ...remove] = duplicate.docs;
                const delRes = await Show.deleteMany({ _id: { $in: remove } });
                deletedCount += delRes.deletedCount;
            }
            console.log(`Deleted ${deletedCount} duplicate shows.`);
        } else {
            console.log("No duplicate shows found.");
        }

    } catch (error) {
        console.error(`Error cleaning ${dbName}:`, error);
    }
};

const runAllCleanups = async () => {
    // Clean both commonly used names to be safe
    await cleanDB('quickshow');
    await cleanDB('movieswift');
    console.log("\nAll cleanups finished!");
    process.exit(0);
};

runAllCleanups();
