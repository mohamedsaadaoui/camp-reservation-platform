const Reservation = require('../models/Reservation');

// Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    
    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obtenir toutes les réservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Obtenir une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Réservation non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Réservation non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Réservation non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Réservation supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Obtenir les réservations par client
exports.getReservationsByClient = async (req, res) => {
  try {
    const reservations = await Reservation.find({ clientId: req.params.clientId })
      .sort({ dateDebut: -1 });
    
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};