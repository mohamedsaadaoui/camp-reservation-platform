require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const reservationRoutes = require('./routes/reservationRoutes');
const eurekaHelper = require('./config/eureka');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/reservations', reservationRoutes);

app.get('/health', (req, res) => {
  const mongoUp = mongoose.connection.readyState === 1;
  res.status(mongoUp ? 200 : 503).json({
    status: mongoUp ? 'UP' : 'DOWN',
    service: 'reservation-service',
    mongo: mongoUp ? 'CONNECTED' : 'DISCONNECTED',
    eureka: eurekaHelper.state.registered ? 'REGISTERED' : 'UNREGISTERED',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Reservation Service is running!',
    endpoints: ['/api/reservations', '/api/reservations/emplacement/:emplacementId', '/health']
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

const start = async () => {
  await connectDB();
  eurekaHelper.start();
  app.listen(PORT, () => {
    console.log(`Reservation Service running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
};

process.on('SIGINT', () => {
  eurekaHelper.stop();
  process.exit();
});

start();

module.exports = app;
