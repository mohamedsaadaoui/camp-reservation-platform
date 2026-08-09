const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'camp-reservation-platform-jwt-secret-key-change-me-0123456789abcdef';

const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentification requise' });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    if (payload.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = { requireAdmin };
