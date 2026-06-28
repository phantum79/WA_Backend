import { saveSyncData } from '../database/syncMessage.js'; // .js extension zaroori hai

export const handleSync = async (req, res) => {
    try {
        const { device_id, unsynced_messages } = req.body;

        if (!unsynced_messages || unsynced_messages.length === 0) {
            return res.status(400).json({ success: false, message: "No data" });
        }

        console.log(`\n[+] New Sync from Device: ${device_id}`);

        // dbHandler ko call kiya
        await saveSyncData(device_id, unsynced_messages);

        res.status(200).json({ success: true, message: "Data securely synced to Firebase" });

    } catch (error) {
        console.error("[-] Error processing sync:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};