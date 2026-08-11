const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { requireAdmin } = require('../middleware/auth');
const { validate, createReservationSchema, updateStatusSchema } = require('../middleware/validate');

// Routes publiques (pas de données personnelles exposées)
router.post('/', validate(createReservationSchema), reservationController.createReservation);
router.get('/emplacement/:emplacementId/disponible', reservationController.checkAvailability);
router.get('/emplacement/:emplacementId/stats', reservationController.getEmplacementStats);

// Routes réservées aux administrateurs (accès aux données personnelles)
router.get('/', requireAdmin, reservationController.getReservations);
router.get('/emplacement/:emplacementId', requireAdmin, reservationController.getReservationsByEmplacement);
router.get('/:id', requireAdmin, reservationController.getReservationById);
router.put('/:id/status', requireAdmin, validate(updateStatusSchema), reservationController.updateReservationStatus);
router.delete('/:id', requireAdmin, reservationController.deleteReservation);

module.exports = router;
