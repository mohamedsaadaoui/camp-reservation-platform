const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Routes CRUD
router.post('/', reservationController.createReservation);
router.get('/', reservationController.getReservations);
router.get('/:id', reservationController.getReservationById);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

// Routes spécifiques
router.get('/client/:clientId', reservationController.getReservationsByClient);

module.exports = router;