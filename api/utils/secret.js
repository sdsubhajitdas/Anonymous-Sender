"use strict";

const AWS = require("aws-sdk");
const _ = require("lodash");
require("dotenv").config();

async function getDatabaseSecret(databaseConnectionSecret) {
  try {
    const conn = new AWS.SecretsManager();
    const params = {
      SecretId: databaseConnectionSecret
        ? databaseConnectionSecret
        : process.env.DATABASE_CONNECTION_SECRET,
    };
    let { SecretString } = await conn.getSecretValue(params).promise();
    return SecretString ? JSON.parse(SecretString) : {};
  } catch (error) {
    throw error;
  }
}

module.exports = { getDatabaseSecret };
