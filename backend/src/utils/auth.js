const crypto = require('crypto');
const UsuarioModel = require('../models/usuario.model');

const AUTH_ERROR_MESSAGES = {
  missingIdentity: 'No autorizado, auth-id o JWT requerido',
  invalidToken: 'JWT inválido',
  unsupportedAlgorithm: 'Algoritmo JWT no soportado',
  missingSecret: 'JWT_SECRET no configurado en el servidor',
  missingAuthId: 'El JWT no contiene auth_id',
  userNotFound: 'Usuario no encontrado',
  tokenNotYetValid: 'JWT aún no válido',
  tokenExpired: 'JWT expirado',
};

const JWT_ALGORITHMS = {
  HS256: 'sha256',
  HS384: 'sha384',
  HS512: 'sha512',
};

function createAuthError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function base64UrlDecode(value) {
  let normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');

  while (normalizedValue.length % 4 !== 0) {
    normalizedValue += '=';
  }

  return Buffer.from(normalizedValue, 'base64').toString('utf8');
}

function toBase64Url(buffer) {
  return buffer
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function safeEquals(leftValue, rightValue) {
  const leftBuffer = Buffer.from(leftValue);
  const rightBuffer = Buffer.from(rightValue);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getAuthIdFromRequest(req) {
  return req.headers['auth-id'] || req.body?.auth_id || req.body?.authId || null;
}

function getTokenFromRequest(req) {
  const authorizationHeader = req.headers.authorization || req.headers.Authorization;

  if (typeof authorizationHeader === 'string' && authorizationHeader.startsWith('Bearer ')) {
    return authorizationHeader.slice(7).trim();
  }

  return req.headers['x-auth-token'] || req.headers['x-access-token'] || req.body?.token || null;
}

function extractAuthIdFromPayload(payload) {
  const authId =
    payload.auth_id ||
    payload.authId ||
    payload.sub ||
    payload.user_id ||
    payload.userId ||
    payload.id;

  if (authId === undefined || authId === null || authId === '') {
    return null;
  }

  return String(authId);
}

function verifyJwtToken(token) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw createAuthError(500, AUTH_ERROR_MESSAGES.missingSecret);
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    throw createAuthError(401, AUTH_ERROR_MESSAGES.invalidToken);
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  let header;
  let payload;

  try {
    header = JSON.parse(base64UrlDecode(encodedHeader));
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch (error) {
    throw createAuthError(401, AUTH_ERROR_MESSAGES.invalidToken);
  }

  const digestAlgorithm = JWT_ALGORITHMS[header.alg];

  if (!digestAlgorithm) {
    throw createAuthError(400, AUTH_ERROR_MESSAGES.unsupportedAlgorithm);
  }

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = toBase64Url(
    crypto.createHmac(digestAlgorithm, secret).update(unsignedToken).digest()
  );

  if (!safeEquals(encodedSignature, expectedSignature)) {
    throw createAuthError(401, AUTH_ERROR_MESSAGES.invalidToken);
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (typeof payload.nbf === 'number' && payload.nbf > currentTime) {
    throw createAuthError(401, AUTH_ERROR_MESSAGES.tokenNotYetValid);
  }

  if (typeof payload.exp === 'number' && payload.exp <= currentTime) {
    throw createAuthError(401, AUTH_ERROR_MESSAGES.tokenExpired);
  }

  return { header, payload };
}

async function resolveAuthContext(req) {
  const token = getTokenFromRequest(req);

  if (token) {
    const { payload } = verifyJwtToken(token);
    const authId = extractAuthIdFromPayload(payload);

    if (!authId) {
      throw createAuthError(401, AUTH_ERROR_MESSAGES.missingAuthId);
    }

    const usuario = await UsuarioModel.getByAuthId(authId);

    if (!usuario) {
      throw createAuthError(401, AUTH_ERROR_MESSAGES.userNotFound);
    }

    return {
      source: 'jwt',
      token,
      authId,
      payload,
      usuario,
    };
  }

  const authId = getAuthIdFromRequest(req);

  if (!authId) {
    throw createAuthError(401, AUTH_ERROR_MESSAGES.missingIdentity);
  }

  const usuario = await UsuarioModel.getByAuthId(String(authId));

  if (!usuario) {
    throw createAuthError(401, AUTH_ERROR_MESSAGES.userNotFound);
  }

  return {
    source: 'auth-id',
    authId: String(authId),
    usuario,
  };
}

module.exports = {
  resolveAuthContext,
  getTokenFromRequest,
  getAuthIdFromRequest,
  verifyJwtToken,
};