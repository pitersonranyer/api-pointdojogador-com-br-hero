const Competicao = require('../model/competicao');
const sequelize = require('../database/database');


const cadastrarCompeticao = dadosCompeticao => {

  if (dadosCompeticao.id_liga === 1) { // POINT DO JOGADOR
    dadosCompeticao.prioridade_de_consulta = 0;
  } else {
    dadosCompeticao.prioridade_de_consulta = 1;
  }

  return Competicao.findOne({
    where:
    {
      id_liga: dadosCompeticao.id_liga,
      tipo_competicao: dadosCompeticao.tipo_competicao
    }
  }).then(psq1 => {
    if (psq1 === null) {

      return Competicao.max('id_competicao').then(max => {
        if (Number.isNaN(max)) {
          max = 0;
          const numMax = max + 1;
          dadosCompeticao.id_competicao = numMax;
          const competicao = new Competicao({ ...dadosCompeticao });
          competicao.save();
          return true;
        } else {
          const numMax = max + 1;
          dadosCompeticao.id_competicao = numMax;
          const competicao = new Competicao({ ...dadosCompeticao });
          competicao.save();
          return true;
        }
      });

    } else {
      return false
    }
  });

};

const delCompeticaoPorId = (id_competicao) => {
  return Competicao.destroy({
    where:
    {
      id_competicao: id_competicao
    }
  })
    .then(function (deletedRecord) {
      if (deletedRecord === 1) {
        return true;
      }
      else {
        return false;
      }
    }).catch(function (error) {
      return false;
    });

};

const putCompeticao = dadosCompeticao => {

  const id_competicao = dadosCompeticao.id_competicao;
  const id_liga = dadosCompeticao.id_liga;
  const nome_competicao = dadosCompeticao.nome_competicao;
  const rodada_inicio = dadosCompeticao.rodada_inicio;
  const rodada_fim = dadosCompeticao.rodada_fim;
  const numero_rodada_atual = dadosCompeticao.numero_rodada_atual;
  const data_fim_inscricao = dadosCompeticao.data_fim_inscricao;
  const hora_fim_inscricao = dadosCompeticao.hora_fim_inscricao;
  const valor_competicao = dadosCompeticao.valor_competicao;
  const valor_tx_adm = dadosCompeticao.valor_tx_adm;
  const status_competicao = dadosCompeticao.status_competicao;
  const tipo_competicao = dadosCompeticao.tipo_competicao;
  const link_grupo_wapp = dadosCompeticao.link_grupo_wapp;
  const prioridade_de_consulta = dadosCompeticao.prioridade_de_consulta;
  

  return Competicao.update(
    {
      id_liga: id_liga,
      nome_competicao: nome_competicao,
      rodada_inicio: rodada_inicio,
      rodada_fim: rodada_fim,
      numero_rodada_atual: numero_rodada_atual,
      data_fim_inscricao: data_fim_inscricao,
      hora_fim_inscricao: hora_fim_inscricao,
      valor_competicao: valor_competicao,
      valor_tx_adm: valor_tx_adm,
      status_competicao: status_competicao,
      tipo_competicao: tipo_competicao,
      link_grupo_wapp: link_grupo_wapp,
      prioridade_de_consulta: prioridade_de_consulta
    },
    {
      where: {
        id_competicao: id_competicao
      }
    }
  ).then(function (updatedRecord) {
    if (updatedRecord) {
      return true;
    }
    else {
      return false;
    }
  });
};


const getTodasCompeticoes = () => {
  return Competicao.findAll()
    .then(data => {
      if (data === null) {
        return false;
      } else {
        return data;
      }
    });
};

module.exports = {
  cadastrarCompeticao,
  delCompeticaoPorId,
  putCompeticao,
  getTodasCompeticoes
};
