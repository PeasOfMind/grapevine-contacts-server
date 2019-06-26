"use strict";

exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/item-adoption-api";
exports.PORT = process.env.PORT || 8080;
