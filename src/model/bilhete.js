const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Bilhete = sequelize.define("bilhete", {


  id_bilhete: {  
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  id_competicao: {  
    allowNull: false,
    type: Sequelize.INTEGER
  },

  ticket_id: { 
    allowNull: false,
    type: Sequelize.STRING(12)
  },

  valor_bilhete: {
    allowNull: false,
    type: Sequelize.DECIMAL(15,2)
  },

  nome_cartola: {
    allowNull: false,
    type: Sequelize.STRING(30)
  },

  status_atual_bilhete: { //Gerado, Pago, Cancelado
    allowNull: false,
    type: Sequelize.STRING(20)
  },

  
  
},

  {
    freezeTableName: true,
    timestamps: false

  });

module.exports = Bilhete;
