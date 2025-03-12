const { MongoClient } = require("mongodb");

const uri = "mongodb://root:example@mongodb:27017/";
const dbName = "media-database";

async function initDatabase() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();

        if (!collections.find(col => col.name === "media")) {
            await db.createCollection("media");
            console.log(`Collection 'media' créée dans la base '${dbName}'.`);
        } else {
            console.log(`La collection 'media' existe déjà dans '${dbName}'.`);
        }
    } catch (err) {
        console.error("Erreur lors de l'initialisation de la base MongoDB :", err);
    } finally {
        await client.close();
    }
}

initDatabase();
