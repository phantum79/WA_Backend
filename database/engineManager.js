import { db } from './config.js'; 

export const getEngineStatusFromDB = async () => {
    try {
        // 'Settings' collection me 'engineConfig' naam ka document
        const docRef = db.collection('Settings').doc('engineConfig');
        const doc = await docRef.get();

        if (!doc.exists) {
            // Agar database naya hai aur document nahi bana, toh default false bhejo
            return { start: false };
        }
        return doc.data(); 
    } catch (error) {
        console.error("[-] Database Error in getEngineStatusFromDB:", error);
        throw error;
    }
};

export const updateEngineStatusInDB = async (startStatus) => {
    try {
        const docRef = db.collection('Settings').doc('engineConfig');
        
        // Status update karo (true ya false)
        await docRef.set({ 
            start: startStatus,
            last_updated: Date.now()
        }, { merge: true });

        console.log(`[+] Database Update: Engine status set to [${startStatus}]`);
        return true;
    } catch (error) {
        console.error("[-] Database Error in updateEngineStatusInDB:", error);
        throw error;
    }
};

export const getExecuteFlag = async () => {
    try {
        const doc = await db.collection('Settings').doc('shouldExecute').get();
        if (!doc.exists) return { execute: false }; // Default false
        return doc.data();
    } catch (error) {
        console.error("[-] DB Error in getExecuteFlag:", error);
        throw error;
    }
};

export const updateExecuteFlag = async (value) => {
    try {
        await db.collection('Settings').doc('shouldExecute').set({ execute: value }, { merge: true });
        return true;
    } catch (error) {
        console.error("[-] DB Error in updateExecuteFlag:", error);
        throw error;
    }
};