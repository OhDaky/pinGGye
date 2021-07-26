const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DATABASE_LOCAL_USERNAME,
    password: process.env.DATABASE_LOCAL_PASSWORD,
    database: process.env.DATABASE_LOCAL_NAME,
    host: process.env.DATABASE_LOCAL_HOST,
    port: process.env.DATABASE_LOCAL_PORT,
    dialect: "mysql",
    timezone: "+09:00",
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "+09:00",
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "mysql",
    timezone: "+09:00",
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    logging: false,
  },
};
