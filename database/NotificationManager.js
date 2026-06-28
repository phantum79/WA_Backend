// database/NotificationManager.js
import { db } from './config.js'; 
import axios from 'axios'; 

// 1. Database mein Notification Save Karne Ka Function
export const saveNotificationToDB = async (payload) => {
    try {
        // Payload se directly values nikal kar object me daalo
        const newAlertData = {
          device_id: payload.device_id,
          content: payload.content,
          timestamp: Date.now(), 
          date_formatted: new Date().toLocaleString("en-IN"), 
          status: "unread", 
        };

        // .add() use kar rahe hain taaki har baar ek naya document bane aur overwrite na ho
        const docRef = await db.collection('notification').add(newAlertData);
        
        console.log(`[+] Database: NEW Alert created with DB ID [${docRef.id}] for device [${payload.device_id}].`);
    } catch (error) {
        console.error("[-] DB Error saving notification:", error);
    }
};

// 2. Admin (Expo App) ko Push Bhejne Ka Function
export const sendPushToAdmin = async (title, body) => {
    try {
        const adminDoc = await db.collection('Settings').doc('adminConfig').get();
        
        if (!adminDoc.exists || !adminDoc.data().expo_push_token) {
            console.log("[-] Push Notification Failed: Admin token not found in DB.");
            return false;
        }

        const pushToken = adminDoc.data().expo_push_token;

        const message = {
            to: pushToken,
            sound: 'default',
            title: title,
            body: body,
            badge: 1,
        };

        const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
            headers: {
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            }
        });

        console.log(`[+] Expo Push Status (Axios): ${response.status}`);
        return true;

    } catch (error) {
        console.error("[-] Axios Error inside sendPushToAdmin:", error.message);
    }
};