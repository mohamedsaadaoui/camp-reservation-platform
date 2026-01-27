const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Eureka = require('eureka-js-client').Eureka;

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration Eureka Client
const eurekaClient = new Eureka({
  instance: {
    app: 'reservation-service',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://localhost:${PORT}/health`,
    healthCheckUrl: `http://localhost:${PORT}/health`,
    port: {
      '$': PORT,
      '@enabled': 'true',
    },
    vipAddress: 'reservation-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// **CONNEXION MONGODB SIMPLIFIÉE**
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/camping';
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connecté avec succès');
    } catch (error) {
        console.error('❌ Erreur MongoDB:', error.message);
        process.exit(1);
    }
};

// **MODÈLE RÉSERVATION SIMPLE**
const reservationSchema = new mongoose.Schema({
    emplacementId: String,
    clientNom: String,
    clientEmail: String,
    dateDebut: Date,
    dateFin: Date,
    prixTotal: Number,
    statut: { type: String, default: 'CONFIRMEE' }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

// **ROUTES SIMPLIFIÉES**
// GET toutes les réservations
app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST nouvelle réservation
app.post('/api/reservations', async (req, res) => {
    try {
        const { emplacementId, clientNom, clientEmail, dateDebut, dateFin, prixTotal } = req.body;
        
        const reservation = new Reservation({
            emplacementId,
            clientNom,
            clientEmail,
            dateDebut: new Date(dateDebut),
            dateFin: new Date(dateFin),
            prixTotal
        });
        
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET réservation par ID
app.get('/api/reservations/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **NOUVELLES ROUTES POUR FEIGN CLIENT**
// GET réservations par emplacement
app.get('/api/reservations/emplacement/:emplacementId', async (req, res) => {
    try {
        const reservations = await Reservation.find({ emplacementId: req.params.emplacementId });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vérifier disponibilité d'un emplacement
app.get('/api/reservations/emplacement/:emplacementId/disponible', async (req, res) => {
    try {
        const { emplacementId } = req.params;
        const { dateDebut, dateFin } = req.query;
        
        // Vérifier s'il y a des réservations qui se chevauchent
        const reservations = await Reservation.find({
            emplacementId,
            $or: [
                {
                    dateDebut: { $lte: new Date(dateFin) },
                    dateFin: { $gte: new Date(dateDebut) }
                }
            ]
        });
        
        // Si aucune réservation trouvée, l'emplacement est disponible
        const disponible = reservations.length === 0;
        res.json(disponible);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route de santé
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'reservation-service',
        timestamp: new Date().toISOString(),
        mongo: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
        eureka: 'REGISTERED'
    });
});

// Route par défaut
app.get('/', (req, res) => {
    res.json({
        message: 'Reservation Service is running!',
        endpoints: {
            reservations: '/api/reservations',
            health: '/health'
        }
    });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée'
    });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage du serveur
const startServer = async () => {
    await connectDB();
    
    // Démarrer Eureka Client
    eurekaClient.start(error => {
        if (error) {
            console.log('❌ Erreur Eureka:', error);
        } else {
            console.log('✅ Service enregistré dans Eureka');
        }
    });

    app.listen(PORT, () => {
        console.log(`🎯 Reservation Service démarré sur le port ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/health`);
        console.log(`📍 API: http://localhost:${PORT}/api/reservations`);
        console.log(`📍 Eureka: http://localhost:8761`);
    });
};

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('🛑 Arrêt du service...');
    eurekaClient.stop();
    process.exit();
});

startServer();

module.exports = app;