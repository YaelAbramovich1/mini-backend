// utils/http.js
class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status || 500;
    this.details = details;
  }
}

const ok = (res, data, meta) =>
  res.status(200).json({ ok: true, data, meta });

const created = (res, data) =>
  res.status(201).json({ ok: true, data });

module.exports = { ApiError, ok, created };
