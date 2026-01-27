const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Client'
  },
  emplacementId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
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
    required: true,
    min: 1
  },
  statut: {
    type: String,
    enum: ['confirmée', 'en_attente', 'annulée'],
    default: 'en_attente'
  },
  prixTotal: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
reservationSchema.index({ clientId: 1, dateDebut: 1 });
reservationSchema.index({ emplacementId: 1, dateDebut: 1, dateFin: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);