const sequelize = require('../database/database');

const Atleta = require('../model/atleta');
const Atleta_Pontuado = require('../model/atleta_pontuado');
const Scout_Atleta = require('../model/scout_atleta');
const Escalacao_Time_Rodada = require('../model/escalacao_time_rodada');
const Substituicao_Time_Rodada = require('../model/substituicao_time_rodada');



const cadastrarAtleta = dadosAtleta => {

  // Salvar dados atleta
  const atleta = new Atleta({ ...dadosAtleta });
  atleta.save();

};

const cadastrarAtletasPontuados = dadosAtletaPontuados => {

  // Salvar dados atleta pontuados
  const atleta_pontuado = new Atleta_Pontuado({ ...dadosAtletaPontuados });
  atleta_pontuado.save();

};

const cadastrarScoutAtleta = dadosScoutAtleta => {

  // Salvar dados scout atleta
  const scout_atleta = new Scout_Atleta({ ...dadosScoutAtleta });
  scout_atleta.save();

};

const cadastrarEscalacaoTimeRodada = dadosEscalacaoTimeRodada => {

  // Salvar dados escalacao time rodada
  const escalacao_time_rodada = new Escalacao_Time_Rodada({ ...dadosEscalacaoTimeRodada });
  escalacao_time_rodada.save();

};

const cadastrarSubstituicaoTimeRodada = dadosSubstituicaoTimeRodada => {

  // Salvar dados subistituicao time rodada
  const substituicao_time_rodada = new Substituicao_Time_Rodada({ ...dadosSubstituicaoTimeRodada });
  substituicao_time_rodada.save();

};

module.exports = {
  cadastrarAtleta,
  cadastrarAtletasPontuados,
  cadastrarScoutAtleta,
  cadastrarEscalacaoTimeRodada,
  cadastrarSubstituicaoTimeRodada
};
