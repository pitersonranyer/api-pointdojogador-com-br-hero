const Time_Competicao = require('../model/time_competicao');
const Time_Cartola = require('../model/time_cartola');
const Bilhete = require('../model/bilhete');
const sequelize = require('../database/database');

let data = new Date();
let anoAtual = data.getFullYear();

const cadastrarTimeCompeticao = async dadosTime_competicao => {

  var bilhete_aux = 0;
  var ticket_id_aux = '';
  var gravouTime = 'N';

  max = await sequelize.query("SELECT max(id_bilhete)  as `max` " +
    "FROM `bilhete` "

    , {
      type: sequelize.QueryTypes.SELECT
    });


  if ((max[0].max === null)) {
    let numbersAsString = `${anoAtual}${'00000'}`;
    max[0].max = numbersAsString;
    const numMax = max[0].max + 1;
    bilhete_aux = numMax;
  } else {
    const numMax = max[0].max + 1;
    bilhete_aux = numMax;

  }

  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var ind = 0; ind < 6; ind++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  ticket_id_aux = "pJ" + anoAtual + text;


  for (let i = 0; i < dadosTime_competicao.length; i++) {

    dadosTime_competicao[i].numero_rodada = dadosTime_competicao[0].numero_rodada
    dadosTime_competicao[i].id_competicao = dadosTime_competicao[0].id_competicao

    times = await sequelize.query("SELECT `time_competicao`.`time_id` " +
      "FROM `time_competicao` " +
      " WHERE `time_competicao`.`numero_rodada` " + `= ${dadosTime_competicao[i].numero_rodada} ` +
      " AND `time_competicao`.`id_competicao` " + `= ${dadosTime_competicao[i].id_competicao} ` +
      " AND `time_competicao`.`time_id` " + `= ${dadosTime_competicao[i].time_id} `

      , {
        type: sequelize.QueryTypes.SELECT
      });


    if (times.length === 0) {

      const dadosTimesCompeticao = {
        numero_rodada: dadosTime_competicao[i].numero_rodada,
        id_competicao: dadosTime_competicao[i].id_competicao,
        time_id: dadosTime_competicao[i].time_id,
        id_bilhete: bilhete_aux
      };

      const dadosTimesCartola = {
        time_id: dadosTime_competicao[i].time_id,
        assinante: dadosTime_competicao[i].assinante,
        foto_perfil: dadosTime_competicao[i].foto_perfil,
        nome: dadosTime_competicao[i].nome,
        nome_cartola: dadosTime_competicao[i].nome_cartola,
        slug: dadosTime_competicao[i].slug,
        url_escudo_png: dadosTime_competicao[i].url_escudo_png,
        url_escudo_svg: dadosTime_competicao[i].url_escudo_svg,
        facebook_id: dadosTime_competicao[i].facebook_id,
      };

      // Salvar dados do times da competição
      const time_competicao = new Time_Competicao({ ...dadosTimesCompeticao });
      time_competicao.save();

      // Salvar dados do times cartola
      Time_Cartola.findOne({ where: { time_id: dadosTimesCartola.time_id } }).then(listado => {
        if (listado === null) {
          const time_Cartola = new Time_Cartola({ ...dadosTimesCartola });
          time_Cartola.save();
        } else {
          Time_Cartola.update({
            assinante: dadosTimesCartola.assinante,
            foto_perfil: dadosTimesCartola.foto_perfil,
            nome: dadosTimesCartola.nome,
            nome_cartola: dadosTimesCartola.nome_cartola,
            slug: dadosTimesCartola.slug,
            url_escudo_png: dadosTimesCartola.url_escudo_png,
            url_escudo_svg: dadosTimesCartola.url_escudo_svg,
            facebook_id: dadosTimesCartola.facebook_id
          },
            { where: { time_id: dadosTimesCartola.time_id } });

        }
      });

      gravouTime = 'S';

    }

  }

  if (gravouTime === 'S') {

    const dadosBilhete = {
      id_bilhete: bilhete_aux,
      id_competicao: dadosTime_competicao[0].id_competicao,
      ticket_id: ticket_id_aux,
      status_atual_bilhete: dadosTime_competicao[0].status_atual_bilhete,
      valor_bilhete: dadosTime_competicao[0].valor_bilhete,
      nome_cartola: dadosTime_competicao[0].nome_usuario
    };


    //Gravar bilhete

    const bilhete = new Bilhete({ ...dadosBilhete });
    bilhete.save();


    const retDados = {
      id_bilhete: dadosBilhete.id_bilhete,
      ticket_id: dadosBilhete.ticket_id
    };

    return retDados;

  } else {
    return false
  }

};


const getTimesDaCompeticao = async (id_competicao, numero_rodada_atual) => {


  result = await sequelize.query("Select `a`.`numero_rodada` " +
    ", `a`.`id_competicao` " +
    ", `a`.`time_id` " +
    ", `a`.`id_bilhete` " +
    ", `a`.`pontuacao_rodada` " +
    ", `a`.`pontuacao_rodada_sem_capitao` " +
    ", `a`.`pontuacao_mensal` " +
    ", `a`.`pontuacao_primeiro_turno` " +
    ", `a`.`pontuacao_segundo_turno` " +
    ", `a`.`pontuacao_total` " +
    ", `a`.`colocacao_rodada` " +
    ", `a`.`qtde_jogador_pontuado` " +
    ", `b`.`numero_rodada_atual` " +
    ", `b`.`valor_competicao` " +
    ", `b`.`tipo_competicao` " +
    ", `c`.`assinante` " +
    ", `c`.`foto_perfil` " +
    ", `c`.`nome` " +
    ", `c`.`nome_cartola` " +
    ", `c`.`slug` " +
    ", `c`.`url_escudo_png` " +
    ", `c`.`url_escudo_svg` " +
    ", `c`.`facebook_id` " +
    "from `time_competicao` `a` " +
    "  inner join `competicao` `b` " +
    "  on `b`.`id_competicao` = `a`.`id_competicao` " +
    "  inner join `time_cartola` `c` " +
    "  on `c`.`time_id` = `a`.`time_id` " +
    "  inner join `bilhete` `d` " +
    "  on  `d`.`id_bilhete`    = `a`.`id_bilhete` " +
    "  and `d`.`id_competicao` = `a`.`id_competicao` " +
    "where `a`.`id_competicao` =  " + `${id_competicao} ` +
    "and  `b`.`numero_rodada_atual` = " + `${numero_rodada_atual} ` +
    "and   `d`.`status_atual_bilhete` = 'Pago' " +
    "order by `a`.`pontuacao_rodada` desc "
    , {
      type: sequelize.QueryTypes.SELECT
    });


  if (result.length > 0) {

    for (let i = 0; i < result.length; i++) {


      if (result[i].tipo_competicao === 'TIRO CURTO') {
        premiacaoTotal = result.length * result[i].valor_competicao;
        premiacaoPercentualLista = 0;
        premiacaoFinalLista = 0;
        result[i].premiacaoFinalFormatLista = '';
        if (i === 0) {
          premiacaoPercentualLista = (premiacaoTotal * 50) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }
        if (i === 1) {
          premiacaoPercentualLista = (premiacaoTotal * 15) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }
        if (i === 2) {
          premiacaoPercentualLista = (premiacaoTotal * 7) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }
        if (i === 3) {
          premiacaoPercentualLista = (premiacaoTotal * 6) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }
        if (i === 4) {
          premiacaoPercentualLista = (premiacaoTotal * 4) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }
        if (i === 5) {
          premiacaoPercentualLista = (premiacaoTotal * 3) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }
        if (i === 6) {
          premiacaoPercentualLista = (premiacaoTotal * 2) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }
        if (i === 7) {
          premiacaoPercentualLista = (premiacaoTotal * 1.5) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }
        if (i === 8) {
          premiacaoPercentualLista = (premiacaoTotal * 1) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }
        if (i === 9) {
          premiacaoPercentualLista = (premiacaoTotal * 0.5) / 100;
          premiacaoFinalLista = premiacaoPercentualLista;
          result[i].premiacaoFinalFormatLista = premiacaoFinalLista.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        }


      }


      var nrRodada = result[i].numero_rodada
      var idBilhete = result[i].id_bilhete
      var idCompeticao = result[i].id_competicao
      var idTime = result[i].time_id
      var colocacao = i + 1;

      Time_Competicao.update(

        {
          colocacao_rodada: colocacao
        },
        {
          where: {
            numero_rodada: nrRodada,
            id_bilhete: idBilhete,
            id_competicao: idCompeticao,
            time_id: idTime
          }
        }

      )

    }

    return result;
  } else {
    return result = [];
  }


}

const getAtletasTimeCompeticao = async (time_id, numero_rodada) => {

  atletasTitulares = [];
  atletasReservas = [];

  atletas = {};

  result = await sequelize.query("SELECT  `A`.`atleta_titular` " +
    ", `A`.`atleta_capitao` " +
    ", `B`.`atleta_id` " +
    ", `B`.`apelido` " +
    ", `B`.`foto` " +
    ", `B`.`posicao_id` " +
    ", `B`.`clube_id` " +
    ", `C`.`pontuacao` as `pontuacao_sem_capitao` " +
    ", CASE WHEN `A`.`atleta_capitao` = true THEN `C`.`pontuacao` * 2  " +
    "      ELSE `C`.`pontuacao` end   " +
    "   AS  `pontuacao` " +
    "FROM `escalacao_time_rodada` `A` " +
    "    INNER JOIN `atleta` `B` " +
    "  ON  `B`.`atleta_id` = `A`.`atleta_id` " +
    "  LEFT OUTER JOIN `atleta_pontuado` `C`  " +
    "  ON  `C`.`atleta_id` = `A`.`atleta_id` " +
    "  and `C`.`numero_rodada` = `A`.`numero_rodada` " +
    "  WHERE `A`.`time_id`  =  " + `${time_id} ` +
    "  AND   `A`.`numero_rodada` =  " + `${numero_rodada} ` +
    "  ORDER BY `A`.`atleta_titular` DESC, `B`.`posicao_id`"
    , {
      type: sequelize.QueryTypes.SELECT
    });


  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      if (result[i].atleta_titular) {
        atletasTitulares.push(result[i]);
      }
    }

  }


  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      if (!result[i].atleta_titular) {
        atletasReservas.push(result[i]);
      }
    }

  }

  atletas = ({ atletasTitulares, atletasReservas });

  return atletas;
}


const getTimesBilhete = async (numero_rodada, id_competicao, id_bilhete) => {

  result = await sequelize.query("SELECT `B`.`time_id` " +
  " , `B`.`assinante` " +
  " , `B`.`foto_perfil` " +
  " , `B`.`nome` " +
  " , `B`.`nome_cartola` " +
  " , `B`.`slug` " +
  " , `B`.`url_escudo_png` " +
  " , `B`.`url_escudo_svg` " +
  " , `B`.`facebook_id` " +
  " , `A`.`numero_rodada` " +
  " , `A`.`id_competicao` " +
  " , `A`.`id_bilhete` " +
  "  FROM `time_competicao` `A` " +
  "  INNER JOIN `time_cartola` `B`  " +
  " on `B`.`time_id` = `A`.`time_id` " +
  " where `A`.`numero_rodada`   =  " + `${numero_rodada} ` +
  " and   `A`.`id_competicao`   =  " + `${id_competicao} ` +
  " and   `A`.`id_bilhete`      =  " + `${id_bilhete} ` +
  "  ORDER BY `A`.`time_id` "
    , {
      type: sequelize.QueryTypes.SELECT
    });

    if (result.length > 0) {
      return result;
    } else {
      return result = [];
    }


}

module.exports = {
  cadastrarTimeCompeticao,
  getTimesDaCompeticao,
  getAtletasTimeCompeticao,
  getTimesBilhete
};
