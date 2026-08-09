const Reservation = require('../models/Reservation');

const overlapQuery = (emplacementId, dateDebut, dateFin) => ({
  emplacementId,
  statut: { $ne: 'ANNULEE' },
  dateDebut: { $lt: dateFin },
  dateFin: { $gt: dateDebut }
});

exports.createReservation = async (req, res) => {
  try {
    const body = req.body;
    const emplacementId = String(body.emplacementId);
    const dateDebut = new Date(body.dateDebut);
    const dateFin = new Date(body.dateFin);

    if (dateFin.getTime() <= dateDebut.getTime()) {
      return res.status(400).json({ error: 'La date de fin doit être après la date de début' });
    }

    const overlapping = await Reservation.find(overlapQuery(emplacementId, dateDebut, dateFin));
    if (overlapping.length > 0) {
      return res.status(409).json({ error: 'Emplacement déjà réservé sur cette période' });
    }

    const reservation = new Reservation({
      emplacementId,
      clientNom: body.clientNom,
      clientEmail: body.clientEmail,
      clientTelephone: body.clientTelephone,
      dateDebut,
      dateFin,
      nombrePersonnes: body.nombrePersonnes,
      prixTotal: body.prixTotal,
      commentaires: body.commentaires
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.emplacementId) filter.emplacementId = String(req.query.emplacementId);
    if (req.query.status) filter.statut = req.query.status;
    const reservations = await Reservation.find(filter).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: 'Identifiant de réservation invalide' });
  }
};

exports.getReservationsByEmplacement = async (req, res) => {
  try {
    const reservations = await Reservation.find({ emplacementId: String(req.params.emplacementId) })
      .sort({ dateDebut: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const emplacementId = String(req.params.emplacementId);
    const dateDebut = new Date(req.query.dateDebut);
    const dateFin = new Date(req.query.dateFin);

    if (isNaN(dateDebut.getTime()) || isNaN(dateFin.getTime()) || dateFin.getTime() <= dateDebut.getTime()) {
      return res.status(400).json({ error: 'Dates invalides' });
    }

    const overlapping = await Reservation.find(overlapQuery(emplacementId, dateDebut, dateFin));
    res.json(overlapping.length === 0);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    reservation.statut = req.body.statut;
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json({ message: 'Réservation supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
