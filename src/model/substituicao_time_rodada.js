const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Substituicao_Time_Rodada = sequelize.define("substituicao_time_rodada", {

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

  entrou: {
    allowNull: true,
    type: Sequelize.BOOLEAN
  },

  saiu: {
    allowNull: true,
    type: Sequelize.BOOLEAN
  },
  

},

  {
    freezeTableName: true,
    timestamps: false

  });

module.exports = Substituicao_Time_Rodada;
