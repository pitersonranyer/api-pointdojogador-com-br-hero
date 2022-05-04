const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Liga = sequelize.define("liga", {
  id_liga: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  id_usuario: {
    allowNull: true,
    type: Sequelize.INTEGER
  },
  
  nome_liga: {
    allowNull: false,
    type: Sequelize.STRING(100) 
  },
 
},

  {
    freezeTableName: true,
    timestamps: false

  });

module.exports = Liga;
