const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Time_Competicao = sequelize.define("time_competicao", {


  numero_rodada: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.SMALLINT
  },

  id_competicao: {  
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  time_id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  
  pontuacao_rodada: {
    allowNull: true,
    type: Sequelize.DECIMAL(10, 2)
  },

  pontuacao_mensal: {
    allowNull: true,
    type: Sequelize.DECIMAL(10, 2)
  },

  pontuacao_primeiro_turno: {
    allowNull: true,
    type: Sequelize.DECIMAL(10, 2)
  },

  pontuacao_segundo_turno: {
    allowNull: true,
    type: Sequelize.DECIMAL(10, 2)
  },

  pontuacao_total: {
    allowNull: true,
    type: Sequelize.DECIMAL(10, 2)
  },

  colocacao_rodada: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },

  
  
},

  {
    freezeTableName: true,
    timestamps: false

  });

module.exports = Time_Competicao;
