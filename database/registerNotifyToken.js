import { db } from './config.js';

export const registerNotifyToken = async (req, res) => {
    try {
        const { expo_push_token } = req.body;

        if (!expo_push_token) {
            return res.status(400).json({ success: false, message: "Missing expo_push_token in payload" });
        }

        // Firebase me Settings -> adminConfig ke andar token update kar denge
        const docRef = db.collection('Settings').doc('adminConfig');
        await docRef.set({
            expo_push_token: expo_push_token,
            last_updated: Date.now()
        }, { merge: true });

        console.log(`\n[+] Admin System: Expo Push Token Updated Successfully.`);
        res.status(200).json({ success: true, message: "Admin push token securely registered." });

    } catch (error) {
        console.error("[-] Error registering admin token:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};