const Competicao = require('../model/competicao');
const sequelize = require('../database/database');


const cadastrarCompeticao = dadosCompeticao => {

  if (dadosCompeticao.id_liga === 1) { // POINT DO JOGADOR
    dadosCompeticao.prioridade_de_consulta = 0;
  } else {
    dadosCompeticao.prioridade_de_consulta = 1;
  }

  if (dadosCompeticao.tipo_competicao === "TIRO CURTO") {
    dadosCompeticao.rodada_inicio = dadosCompeticao.numero_rodada_atual;
    dadosCompeticao.rodada_fim = dadosCompeticao.numero_rodada_atual;
  }

  return Competicao.findOne({
    where:
    {
      id_liga: dadosCompeticao.id_liga,
      tipo_competicao: dadosCompeticao.tipo_competicao,
      numero_rodada_atual: dadosCompeticao.numero_rodada_atual
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


const getCompeticaoAtivas = async () => {

  dadosCompeticao = await sequelize.query("SELECT `competicao`.`id_competicao` " +
    " ,  `competicao`.`id_liga` " +
    " ,  `competicao`.`nome_competicao` " +
    " ,  `competicao`.`rodada_inicio` " +
    " ,  `competicao`.`rodada_fim` " +
    " ,  `competicao`.`numero_rodada_atual` " +
    " ,  `competicao`.`data_fim_inscricao` " +
    " ,  `competicao`.`hora_fim_inscricao` " +
    " ,  `competicao`.`valor_competicao` " +
    " ,  `competicao`.`valor_tx_adm` " +
    " ,  `competicao`.`status_competicao` " +
    " ,  `competicao`.`tipo_competicao` " +
    " ,  `competicao`.`link_grupo_wapp` " +
    " ,  `competicao`.`prioridade_de_consulta` " +
    " FROM  `competicao` " +
    " WHERE `competicao`.`status_competicao` <> 'Encerrada' " +
    " order by  `competicao`.`prioridade_de_consulta` ASC "
    , {
      type: sequelize.QueryTypes.SELECT
    });

  nrSequenciais = dadosCompeticao.map((comp) => comp.id_competicao);


  if (nrSequenciais.length > 0) {

    totalParticipantes = 0;
    premiacaoTotal = 0;
    premiacaoPercentual = 0;
    premiacaoFinal = 0;
    premiacaoFinalFormat = '';

    for (let i = 0; i < nrSequenciais.length; i++) {

      totalTimes = await sequelize.query("SELECT COUNT(*) as `count` " +
        "FROM `bilhete` " +
        "INNER JOIN `time_competicao`  " +
        "ON `bilhete`.`id_competicao` = `time_competicao`.`id_competicao` " +
        "and `bilhete`.`id_bilhete` = `time_competicao`.`id_bilhete`" +
        " WHERE `bilhete`.`id_competicao` " + `= "${nrSequenciais[i]}" ` +
        " AND `time_competicao`.`numero_rodada` " + `= "${dadosCompeticao[i].numero_rodada_atual}" ` +
        " AND `bilhete`.`status_atual_bilhete` = 'Pago' "
        , {
          type: sequelize.QueryTypes.SELECT
        });

      dadosCompeticao[i].totalParticipantes = totalTimes[0].count;

      premiacaoTotal = dadosCompeticao[i].totalParticipantes * dadosCompeticao[i].valor_competicao;
      premiacaoPercentual = (premiacaoTotal * dadosCompeticao[i].valor_tx_adm) / 100;
      premiacaoFinal = premiacaoTotal - premiacaoPercentual;

      dadosCompeticao[i].premiacaoFinalFormat = premiacaoFinal.toLocaleString('pt-br', { minimumFractionDigits: 2 });
      dadosCompeticao[i].dataFim = dadosCompeticao[i].data_fim_inscricao.substring(0, 5);
      dadosCompeticao[i].horaFim = dadosCompeticao[i].hora_fim_inscricao.substring(0, 5);


      

    }


  } else {
    return false
  }


  return dadosCompeticao;



}


const getBilheteCompeticaoGerado = async () => {

  dadosBilheteCompeticao = await sequelize.query("SELECT `a`.`id_competicao`" +
    " , `a`.`id_liga`" +
    " , `a`.`nome_competicao`" +
    " , `a`.`rodada_inicio`" +
    " , `a`.`rodada_fim`" +
    " , `a`.`numero_rodada_atual`" +
    " , `a`.`data_fim_inscricao`" +
    " , `a`.`hora_fim_inscricao`" +
    " , `a`.`valor_competicao`" +
    " , `a`.`valor_tx_adm`" +
    " , `a`.`status_competicao`" +
    " , `a`.`tipo_competicao`" +
    " , `a`.`link_grupo_wapp`" +
    " , `a`.`prioridade_de_consulta`" +
    " , `b`.`id_bilhete`" +
    " , `b`.`ticket_id`" +
    " , `b`.`valor_bilhete`" +
    " , `b`.`nome_cartola`" +
    " , `b`.`status_atual_bilhete`" +
    " FROM `competicao` `a`" +
    " INNER JOIN `bilhete` `b`" +
    " on `b`.`id_competicao` = `a`.`id_competicao`" +
    "WHERE `b`.`status_atual_bilhete` = 'Finalizado' "
    , {
      type: sequelize.QueryTypes.SELECT
    });


  if (dadosBilheteCompeticao.length > 0) {
    return dadosBilheteCompeticao;
  } else {
    return false
  }


}

module.exports = {
  cadastrarCompeticao,
  delCompeticaoPorId,
  putCompeticao,
  getTodasCompeticoes,
  getCompeticaoAtivas,
  getBilheteCompeticaoGerado
};
