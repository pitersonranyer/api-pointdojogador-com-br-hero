module.exports = {
  development: {
    database: {

// --> banco atual. UMBLER
//    host: "mysql669.umbler.com",
//    name: "pointdojogador-u",
//    dialect: "mysql",
//   user: "piterson",
//    password: "sWXFuvbtpFA3V6i",

// --> UOL HOST
// host: "pointdojogador.mysql.uhserver.com",
// name: "pointdojogador",
// dialect: "mysql",
// user: "pointdojogador",
// password: "Piter4152@",      

/* Nome do banco : pointdojogador
   Nome de usuário: pointdojogador
   Senha: Piter4152@
*/


// --> banco antigo
//      host: "mysql669.umbler.com",
//      name: "pointdojogador",
//      dialect: "mysql",
//      user: "pointdojogador",
//      password: "xedsi5-soWpet-cextek",

// --> HEROKU
// host: "us-cdbr-east-05.cleardb.net",
//      port: 3306,
//      name: "heroku_6686a82ce984b99",
//      dialect: "mysql",
//      user: "b1ac962dfa9f37",
//      password: "afe01cee",
//      secret: process.env.JWT_SECRET

      host: "localhost",
      port: 3306,
      name: "point2022",
      dialect: "mysql",
      user: "root",
      password: "admin"
      
    },
    secret: '1C3C7E1694F1E9DAD939399E87E5FFB5DF06B2327CA31B409CB3'
  },

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
