import { getMessaging } from 'firebase-admin/messaging';
import { db } from '../database/config.js'; // .js zaroori hai

export const sendFCMToken = async (req, res) => {
    try {
        // Expo app se yeh char cheezein aayengi
        const { target_device_id, title, message, data } = req.body;

        if (!target_device_id || !title || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // 1. Database se target device ka latest FCM token nikalna
        const docRef = db.collection('targets').doc(target_device_id);
        const doc = await docRef.get();

        if (!doc.exists || !doc.data().fcm_token) {
            return res.status(404).json({ success: false, message: "Device ya FCM token database me nahi mila" });
        }

        const fcmToken = doc.data().fcm_token;

        // 2. FCM Payload Taiyar Karna
        const payload = {
            token: fcmToken,
            notification: {
                title: title,
                body: message
            },
            data: data || {} // Agar UI me notification nahi dikhana aur sirf background me silent command bhejna ho toh iska use hoga
        };

        // 3. Firebase ke through direct push marna
        const response = await getMessaging().send(payload);
        
        console.log(`\n[+] Alert Successfully Sent to [${target_device_id}] | Message ID: ${response}`);
        res.status(200).json({ success: true, message: "Alert sent successfully", message_id: response });

    } catch (error) {
        console.error("[-] Error sending FCM Alert:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const strikeDevice = async (req, res) => {
    try {
        const { token, action } = req.body;

        if (!token || !action) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const payload = {
            token: token,
            data: { action: action } // Payload structure match kiya
        };
        console.log(`\n[+] Strike Command Sent: ${action} to Token: ${token}`);
        const response = await getMessaging().send(payload);
        res.status(200).json({ success: true, message: "Strike delivered", id: response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};