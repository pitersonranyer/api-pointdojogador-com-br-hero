const Time_Cartola = require('../model/time_cartola');
const sequelize = require('../database/database');

const cadastrarTimeCartola = dadosTimeCartola => {

  // Salvar dados scout atleta
  const time_cartola = new Time_Cartola({ ...dadosTimeCartola });
  time_cartola.save();

};


module.exports = {
  cadastrarTimeCartola
};
