import { getEngineStatusFromDB, updateEngineStatusInDB, getExecuteFlag, updateExecuteFlag } from '../database/engineManager.js';

// GET Route Logic (Android puchega: "Bhai kya karu?")
export const getEngineStatus = async (req, res) => {
    try {
        const status = await getEngineStatusFromDB();
        
        // Android ko json bhej do: { "start": true/false }
        res.status(200).json(status);

    } catch (error) {
        console.error("[-] Error reading engine status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// POST Route Logic (Android bolega: "Bhai kaam ho gaya, ab status false kar do")
export const updateEngineStatus = async (req, res) => {
    try {
        const { start } = req.body;

        // Validation: Ensure karo ki 'start' ek boolean hi hai
        if (typeof start !== 'boolean') {
            return res.status(400).json({ success: false, message: "Invalid payload: 'start' must be a boolean" });
        }

        await updateEngineStatusInDB(start);

        res.status(200).json({ success: true, message: "Engine status successfully updated" });

    } catch (error) {
        console.error("[-] Error updating engine status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const handleUpdateExecute = async (req, res) => {
    try {
        const { execute } = req.body;
        if (typeof execute !== 'boolean') {
            return res.status(400).json({ success: false, message: "Invalid value. Boolean required." });
        }
        await updateExecuteFlag(execute);
        res.status(200).json({ success: true, message: `Flag updated to ${execute}` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Android App ke liye (GET request)
export const handleGetExecute = async (req, res) => {
    try {
        const data = await getExecuteFlag();
        res.status(200).json({ success: true, execute: data.execute });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};