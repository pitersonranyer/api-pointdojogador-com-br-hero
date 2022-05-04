const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Atleta = sequelize.define("atleta", {
  
  atleta_id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT
  },

  apelido: {
    allowNull: true,
    type: Sequelize.STRING(40)
  },

  foto: {
    allowNull: true,
    type: Sequelize.STRING(255)
  },
  
  posicao_id: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
  
  clube_id: {
    allowNull: true,
    type: Sequelize.SMALLINT
  },
 

},

  {
    freezeTableName: true,
    timestamps: false

  });

module.exports = Atleta;
