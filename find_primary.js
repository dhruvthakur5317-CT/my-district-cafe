const { MongoClient } = require('mongodb');

// Try each shard to find the PRIMARY
const shards = [
  "mongodb://mydistrictcafe01:mydistrictcafe.ddl.cafeowners9090@ac-wjuvdnn-shard-00-00.owgqlgy.mongodb.net:27017/mydistrictcafe?ssl=true&authSource=admin&directConnection=true",
  "mongodb://mydistrictcafe01:mydistrictcafe.ddl.cafeowners9090@ac-wjuvdnn-shard-00-01.owgqlgy.mongodb.net:27017/mydistrictcafe?ssl=true&authSource=admin&directConnection=true",
  "mongodb://mydistrictcafe01:mydistrictcafe.ddl.cafeowners9090@ac-wjuvdnn-shard-00-02.owgqlgy.mongodb.net:27017/mydistrictcafe?ssl=true&authSource=admin&directConnection=true",
];

async function testShard(uri, idx) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 6000 });
  try {
    await client.connect();
    const admin = client.db("admin");
    const info = await admin.command({ isMaster: 1 });
    const isPrimary = info.ismaster === true || info.isWritablePrimary === true;
    console.log(`Shard-0${idx}: ${isPrimary ? "✅ PRIMARY" : "❌ Secondary"}`);
    if (isPrimary) {
      // Verify write works
      await client.db("mydistrictcafe").command({ ping: 1 });
      console.log(`  -> Use this shard in .env.local!`);
    }
  } catch (err) {
    console.log(`Shard-0${idx}: ❌ Error: ${err.message}`);
  } finally {
    await client.close();
  }
}

(async () => {
  for (let i = 0; i < shards.length; i++) {
    await testShard(shards[i], i);
  }
})();
