const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Escalacao_Time_Rodada = sequelize.define("escalacao_time_rodada", {

  numero_rodada: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.SMALLINT
  },

  time_id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT
  },

  atleta_id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT
  },

  atleta_capitao: {
    allowNull: true,
    type: Sequelize.BOOLEAN
  },

  atleta_titular: {
    allowNull: true,
    type: Sequelize.BOOLEAN
  },

  

},

  {
    freezeTableName: true,
    timestamps: false

  });

module.exports = Escalacao_Time_Rodada;
