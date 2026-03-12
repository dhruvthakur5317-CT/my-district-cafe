const { MongoClient } = require('mongodb');
const uri = "mongodb://mydistrictcafe01:mydistrictcafe.ddl.cafeowners9090@ac-wjuvdnn-shard-00-00.owgqlgy.mongodb.net:27017/mydistrictcafe?ssl=true&authSource=admin&retryWrites=true&w=majority&directConnection=true";

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

async function run() {
  try {
    await client.connect();
    await client.db("mydistrictcafe").command({ ping: 1 });
    console.log("✅ CONNECTED SUCCESSFULLY to MongoDB Atlas!");
  } catch (err) {
    console.error("❌ CONNECTION FAILED:", err.message);
  } finally {
    await client.close();
  }
}
run();
