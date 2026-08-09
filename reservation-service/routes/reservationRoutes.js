const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { requireAdmin } = require('../middleware/auth');
const { validate, createReservationSchema, updateStatusSchema } = require('../middleware/validate');

router.post('/', validate(createReservationSchema), reservationController.createReservation);
router.get('/', reservationController.getReservations);
router.get('/emplacement/:emplacementId/disponible', reservationController.checkAvailability);
router.get('/emplacement/:emplacementId', reservationController.getReservationsByEmplacement);
router.get('/:id', reservationController.getReservationById);
router.put('/:id/status', requireAdmin, validate(updateStatusSchema), reservationController.updateReservationStatus);
router.delete('/:id', requireAdmin, reservationController.deleteReservation);

module.exports = router;
