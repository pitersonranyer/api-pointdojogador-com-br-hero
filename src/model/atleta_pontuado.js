const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Atleta_Pontuado = sequelize.define("atleta_pontuado", {

  numero_rodada: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.SMALLINT
  },

  atleta_id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT
  },

  clube_id: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },

  posicao_id: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },

  apelido: {
    allowNull: true,
    type: Sequelize.STRING(255)
  },

  foto: {
    allowNull: true,
    type: Sequelize.STRING(255)
  },

  pontuacao: {
    allowNull: true,
    type: Sequelize.DECIMAL(10, 2)
  },
  
  entrou_em_campo: {
    allowNull: true,
    type: Sequelize.BOOLEAN
  },

  
  scoutPositivo: {
    allowNull: true,
    type: Sequelize.STRING(255)
  },
  scoutNegativo: {
    allowNull: true,
    type: Sequelize.STRING(255)
  },


  qtde_gols: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  qtde_assistencia: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  qtde_cartao_amarelo: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  qtde_cartao_vermelho: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  qtde_gol_contra: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  saldo_gol: {
    defaultValue: false,
    type: Sequelize.BOOLEAN
  },
  clube_casa_id: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  placar_oficial_mandante: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  abreviacao_mandante: {
    allowNull: true,
    type: Sequelize.STRING(3)
  },
  clube_visitante_id: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  placar_oficial_visitante: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  abreviacao_visitante: {
    allowNull: true,
    type: Sequelize.STRING(3)
  },
  status_transmissao_tr: {
    allowNull: true,
    type: Sequelize.STRING(30)
  },


},

  {
    freezeTableName: true,
    timestamps: false

  });

module.exports = Atleta_Pontuado;
