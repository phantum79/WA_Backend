import { saveTargetDevice, updateDeviceToken, getAllTargets } from '../database/registerDevice.js'; // .js lagana mat bhoolna

export const registerDevice = async (req, res) => {
    try {
        const payload = req.body;

        // Validation: device_id hona bohot zaroori hai
        if (!payload || !payload.device_id) {
            return res.status(400).json({ success: false, message: "Missing device_id in payload" });
        }

        console.log(`\n[+] New Device Registration Hit: ${payload.device_id} | Model: ${payload.model}`);

        // Database function ko call kiya
        await saveTargetDevice(payload);

        // Android ko '200 OK' bhejo
        res.status(200).json({ success: true, message: "Device successfully registered to Backend API" });

    } catch (error) {
        console.error("[-] Error processing device registration:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateToken = async (req, res) => {
    try {
        const { device_id, fcm_token } = req.body;

        // Validation: Dono cheezein honi chahiye
        if (!device_id || !fcm_token) {
            return res.status(400).json({ success: false, message: "Missing device_id or fcm_token" });
        }

        console.log(`\n[+] Token Update Hit for Device: ${device_id}`);

        // Database function ko call kiya
        await updateDeviceToken(device_id, fcm_token);

        res.status(200).json({ success: true, message: "FCM Token successfully updated" });

    } catch (error) {
        console.error("[-] Error processing token update:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getTargetsList = async (req, res) => {
    try {
        console.log(`\n[+] Admin Dashboard requested Targets List`);

        const targets = await getAllTargets();

        // Data ko 'data' key ke andar bhej rahe hain
        res.status(200).json({ 
            success: true, 
            data: targets 
        });

    } catch (error) {
        console.error("[-] Error processing targets fetch:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};