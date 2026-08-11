const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32 || /change-me|default/i.test(JWT_SECRET)) {
  throw new Error(
    '[reservation-service] JWT_SECRET must be set to a strong secret (at least 32 characters). ' +
    'Copy .env.example to .env and set JWT_SECRET, or export it before starting the service.'
  );
}

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
