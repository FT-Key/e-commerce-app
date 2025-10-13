// src/middlewares/sanitizeMiddleware.js
import sanitize from "mongo-sanitize";

export const sanitizeMiddleware = (req, res, next) => {
  // Body sí podemos reasignar
  req.body = sanitize(req.body);

  // Query: mutar cada propiedad
  if (req.query) {
    for (const key in req.query) {
      if (Object.hasOwn(req.query, key)) {
        req.query[key] = sanitize(req.query[key]);
      }
    }
  }

  // Params: mutar cada propiedad
  if (req.params) {
    for (const key in req.params) {
      if (Object.hasOwn(req.params, key)) {
        req.params[key] = sanitize(req.params[key]);
      }
    }
  }

  next();
};
