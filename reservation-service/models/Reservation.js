const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  emplacementId: {
    type: String,
    required: true,
    index: true
  },
  clientNom: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  clientTelephone: {
    type: String,
    trim: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  nombrePersonnes: {
    type: Number,
    min: 1,
    default: 1
  },
  prixTotal: {
    type: Number,
    required: true,
    min: 0
  },
  statut: {
    type: String,
    enum: ['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE'],
    default: 'EN_ATTENTE'
  },
  commentaires: {
    type: String,
    trim: true
  }
}, { timestamps: true });

reservationSchema.index({ emplacementId: 1, dateDebut: 1, dateFin: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
