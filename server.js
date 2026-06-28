import express from 'express';
import cors from 'cors';
import apiRoute from './routes/apiRoutes.js'; // Default import

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes ko mount kiya (Android app ab HTTP POST http://IP:PORT/api/sync par call karegi)
app.use('/api', apiRoute);

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Secure Backend Server running on port ${PORT}`);
});