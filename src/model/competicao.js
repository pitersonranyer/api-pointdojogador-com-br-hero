const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Competicao = sequelize.define("competicao", {

  id_competicao: {  
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  id_liga: {
    allowNull: true,
    type: Sequelize.INTEGER
  },

  nome_competicao: {
    allowNull: true,
    type: Sequelize.STRING(30)
  },

  rodada_inicio: {  
    allowNull: false,
    type: Sequelize.SMALLINT
  },

  rodada_fim: {  
    allowNull: false,
    type: Sequelize.SMALLINT
  },

  numero_rodada_atual: {
    allowNull: false,
    type: Sequelize.SMALLINT
  },

  data_fim_inscricao: {
    allowNull: false,
    type: Sequelize.STRING(10)
  },

  hora_fim_inscricao: {
    allowNull: false,       
    type: Sequelize.STRING(08)
  },

  valor_competicao: {
    allowNull: false,
    type: Sequelize.DECIMAL(15,2)
  },

  valor_tx_adm: {
    allowNull: false,
    type: Sequelize.SMALLINT
  },

  status_competicao: {
    allowNull: false,
    type: Sequelize.STRING(10)
  },

  tipo_competicao: {
    allowNull: false,
    type: Sequelize.STRING(15) 
  },

  link_grupo_wapp: {
    allowNull: false,
    type: Sequelize.STRING(100) 
  },

  prioridade_de_consulta: {
    allowNull: false,
    type: Sequelize.SMALLINT
  },
  
},

  {
    freezeTableName: true,
    timestamps: false

  });

module.exports = Competicao;
