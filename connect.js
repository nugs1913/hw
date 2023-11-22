'use strict';

Error.stackTraceLimit = 50;

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

if (process.env.NODE_ORACLEDB_DRIVER_MODE === 'thick') {

  let clientOpts = {};

  if (process.platform === 'win32' || (process.platform === 'darwin' && process.arch === 'x64')) {
    clientOpts = { libDir: process.env.NODE_ORACLEDB_CLIENT_LIB_DIR };
  }
  oracledb.initOracleClient(clientOpts);  // enable node-oracledb Thick mode
}

console.log(oracledb.thin ? 'Running in thin mode' : 'Running in thick mode');

async function run() {

  let connection;

  try {
    // Get a non-pooled connection

    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      // The statement to execute
      `SELECT * FROM acticle`,
      );

    console.log("Query metadata:", result.metaData);
    console.log("Query rows:", result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        // Connections should always be released when not needed
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();