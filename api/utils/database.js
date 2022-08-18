"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");

const { getDatabaseSecret } = require("./secret");

function connectToDatabase(databaseSecret) {
  if (_.isEmpty(databaseSecret)) throw "Database secret is empty";
  let databaseUri = `mongodb+srv://${databaseSecret.username}:${databaseSecret.password}@${databaseSecret.hostname}/${databaseSecret.databaseName}`;
  return mongoose.connect(databaseUri);
}

async function startDatabaseConnection(databaseConnectionSecret) {
  try {
    let databaseSecret = await getDatabaseSecret(databaseConnectionSecret);
    await connectToDatabase(databaseSecret);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  startDatabaseConnection,
};
