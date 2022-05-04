const Time_Competicao = require('../model/time_competicao');
const sequelize = require('../database/database');


const cadastrarTimeCompeticao = dadosTime_competicao => {

  // Salvar dados do Timebilhete
  const time_competicao = new Time_Competicao({ ...dadosTime_competicao });
  time_competicao.save();


};


module.exports = {
  cadastrarTimeCompeticao
};
