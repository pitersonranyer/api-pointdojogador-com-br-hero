module.exports = {
 /*  development: {
    database: {
      host: "localhost",
      port: 3306,
      name: "point2022",
      dialect: "mysql",
      user: "root",
      password: "admin"
      
    },
    secret: '1C3C7E1694F1E9DAD939399E87E5FFB5DF06B2327CA31B409CB3'
  }, */

  // mysql://b384e9bf87ae1e:4702dcad@us-cdbr-east-05.cleardb.net/heroku_7a38f360dade814?reconnect=true
  production: {
    database: {
      host: "us-cdbr-east-05.cleardb.net",
      port: 3306,
      name: "heroku_7a38f360dade814",
      dialect: "mysql",
      user: "b384e9bf87ae1e",
      password: "4702dcad",
      secret: process.env.JWT_SECRET
    }
  }
};
