import 'dotenv/config';

export const verifyApiKey = (req, res, next) => {
    // Request ke headers se 'x-api-key' nikalna
    const apiKey = req.headers['x-api-key'];

    // 1. Agar key bheji hi nahi
    if (!apiKey) {
        console.log("[-] Blocked Request: Missing API Key");
        return res.status(401).json({ 
            success: false, 
            message: "Access Denied: API Key is missing" 
        });
    }

    // 2. Agar key galat hai
    if (apiKey !== process.env.SYNC_API_KEY) {
        console.log(`[-] Blocked Request: Invalid API Key used -> ${apiKey}`);
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden: Invalid API Key" 
        });
    }

    // 3. Agar key ekdum sahi hai, toh request ko Controller tak jaane do
    next(); 
};