const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; 
const dbName = "media-database";

async function initDatabase() {
    const client = new MongoClient(uri);
    console.log("Initialisation de la base MongoDB...");
    try {
        await client.connect();
        console.log("Connexion à MongoDB réussie");
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();

        if (!collections.find(col => col.name === "media")) {
            await db.createCollection("media");
            console.log(`Collection 'media' créée dans la base '${dbName}'.`);
        } else {
            console.log(`La collection 'media' existe déjà dans '${dbName}'.`);
        }

        if (!collections.find(col => col.name === "playlists")) {
            await db.createCollection("playlists");
            console.log(`Collection 'playlists' créée dans la base '${dbName}'.`);
        } else {
            console.log(`La collection 'playlists' existe déjà dans '${dbName}'.`);
            // delete playlists
            await db.collection("playlists").deleteMany({});
            console.log(`Tous les documents de la collection 'playlists' ont été supprimés.`);

            // delete col playlists
            await db.dropCollection("playlists");
            console.log(`Collection 'playlists' supprimée.`);
        }
        
    } catch (err) {
        console.error("Erreur lors de l'initialisation de la base MongoDB :", err);
    } finally {
        await client.close();
    }
}

initDatabase();
