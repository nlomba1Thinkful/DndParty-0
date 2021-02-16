const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }
  try {
    const payload = AuthService.verifyJwt(bearerToken);
    AuthService.getUserEmail(req.app.get('db'), payload.sub)
      .then((user) => {
        if (!user)
          return res.status(401).json({ error: 'Unauthorized request' });
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } catch (error) {
    if (error.message === 'jwt expired') {
      return res
        .status(401)
        .json({ error: 'Login Token Expired. Please Login again.' });
    }
    return res.status(401).json({ error: 'Unauthorized request' });
  }
}

module.exports = {
  requireAuth,
};
