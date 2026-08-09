const Joi = require('joi');

const createReservationSchema = Joi.object({
  emplacementId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  clientNom: Joi.string().trim().min(2).max(100).required(),
  clientEmail: Joi.string().trim().email().required(),
  clientTelephone: Joi.string().trim().max(30).allow('', null),
  dateDebut: Joi.date().iso().required(),
  dateFin: Joi.date().iso().greater(Joi.ref('dateDebut')).required(),
  nombrePersonnes: Joi.number().integer().min(1).max(20).allow(null),
  prixTotal: Joi.number().min(0).required(),
  commentaires: Joi.string().trim().max(500).allow('', null)
});

const updateStatusSchema = Joi.object({
  statut: Joi.string().valid('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE').required()
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details.map((detail) => detail.message) });
  }
  req.body = value;
  next();
};

module.exports = { createReservationSchema, updateStatusSchema, validate };
