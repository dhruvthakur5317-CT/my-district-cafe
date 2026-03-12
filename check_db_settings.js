const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function getMongoUri() {
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/MONGODB_URI=(.*)/);
        if (match) {
            let uri = match[1].trim();
            // Remove leading/trailing quotes if they exist
            if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
                uri = uri.substring(1, uri.length - 1);
            }
            return uri;
        }
    }
    return process.env.MONGODB_URI;
}

async function checkSettings() {
    const uri = getMongoUri();
    if (!uri) {
        console.error("MONGODB_URI not found in .env.local or process.env");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri, { directConnection: true });
        console.log("Connected.");
        
        const Settings = mongoose.models.Settings || mongoose.model('Settings', new mongoose.Schema({}, { strict: false }));
        const settings = await Settings.findOne();
        
        if (!settings) {
            console.log("No settings found in DB.");
        } else {
            console.log("--- CURRENT SETTINGS IN DB ---");
            console.log("Phone:", settings.phone);
            console.log("Email:", settings.email);
            console.log("Address:", settings.address);
            console.log("Cafe Lat:", settings.cafeLat);
            console.log("Cafe Lon:", settings.cafeLon);
            console.log("Admin User:", settings.adminUsername);
            console.log("Price Color:", settings.priceColor);
            console.log("Price Bw:", settings.priceBw);
            console.log("UPI ID:", settings.upiId);
            console.log("Flash Message:", settings.flashMessage?.isActive ? "ACTIVE" : "INACTIVE");
            if (settings.flashMessage?.isActive) console.log("Flash Text:", settings.flashMessage?.text);
            console.log("-------------------------------");
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkSettings();
