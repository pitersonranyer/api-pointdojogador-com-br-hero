var unirest = require("unirest");
var fs = require("fs");
const Atleta_Pontuado = require('../model/atleta_pontuado');
const Scout_Atleta = require('../model/scout_atleta');
const Escalacao_Time_Rodada = require('../model/escalacao_time_rodada');
const Substituicao_Time_Rodada = require('../model/substituicao_time_rodada');
const Time_Competicao = require('../model/time_competicao');
const Atleta = require('../model/atleta');

const sequelize = require('../database/database');

const BASE_URL = 'https://api.cartolafc.globo.com';

var numeroRodada = 0;
var mercado = 0;


const putAtletasPontuados = async (numero_rodada, statusMercado) => {

  numeroRodada = numero_rodada;
  mercado = statusMercado;

  /* Recuperar lista de atletas pontuados */
  const pontuados = await recuperarAtletasPontuados();

  /* Recuperar resultados e situação de jogos no momento */
  partidas = await recuperarSituacaoPartidas();

  /* Deleta atletas para gravar novamente */
  await atualizarAtletasPontuados(pontuados);

  /* Deleta scout para gravar novamente */
  await gerarScoutJogadores(pontuados);

  /* Atualizar tabela atletas  */
  await atualizarTabelaAtletasPontuados(pontuados);

  /* atualizar substitução banco reservas  */
  await atualizarSubstituiçãoBancoReservas(numeroRodada);


}

const recuperarAtletasPontuados = async () => {


  if (mercado == 2) { // Fechado
    path = `/atletas/pontuados`;
    var url = `${BASE_URL}${path}`;
  } else {
    path = `/atletas/pontuados`;
    var url = `${BASE_URL}${path}/${numeroRodada}`;
  }


  arrayAtletas = [];
  scoutJogador = [];

  dadosAtletas = await unirest.get(url)
    .header(
      "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
      "Accept", "application/json, text/plain, */*",
      "Referer", "https://cartolafc.globo.com/",
      "Origin", "https://cartolafc.globo.com/",
      "Accept-Language", "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2"
    )



  if (dadosAtletas.body) {

    Object.keys(dadosAtletas.body.atletas).forEach(atleta_id => {
      const atleta = {
        atleta_id: atleta_id,
        apelido: dadosAtletas.body.atletas[atleta_id].apelido,
        pontuacao: dadosAtletas.body.atletas[atleta_id].pontuacao,
        foto: dadosAtletas.body.atletas[atleta_id].foto,
        posicao_id: dadosAtletas.body.atletas[atleta_id].posicao_id,
        clube_id: dadosAtletas.body.atletas[atleta_id].clube_id,
        entrou_em_campo: dadosAtletas.body.atletas[atleta_id].entrou_em_campo,
        scout: dadosAtletas.body.atletas[atleta_id].scout,

      };

      atleta.foto = atleta.foto.replace('FORMATO', '140x140');


      arrayAtletas.push(atleta);


    });

    return arrayAtletas;

  }

}

const atualizarAtletasPontuados = async (pontuados) => {

  Atleta_Pontuado.destroy({
    where: {
      numero_rodada: numeroRodada
    }
  });

  for (let ix = 0; ix < pontuados.length; ix++) {
    // Gravar tabela de atletas 
    gravarAtletas(pontuados[ix]);
  }
}

const gravarAtletas = async (objAtletas) => {
  objAtletas.numero_rodada = numeroRodada;
  objAtletas.scoutPositivo = '';
  objAtletas.scoutNegativo = '';
  objAtletas.qtde_gols = 0;
  objAtletas.qtde_assistencia = 0;
  objAtletas.qtde_cartao_amarelo = 0;
  objAtletas.qtde_cartao_vermelho = 0;
  objAtletas.qtde_gol_contra = 0;
  objAtletas.saldo_gol = false;

  //Gravar atletas pontuados
  const atleta_pontuado = new Atleta_Pontuado({ ...objAtletas });
  atleta_pontuado.save();

}

const gerarScoutJogadores = async (pontuados) => {

  Scout_Atleta.destroy({
    where: {
      numero_rodada: numeroRodada
    }
  });

  var scoutJogador = [];
  var idx = 0;

  for (let ix = 0; ix < pontuados.length; ix++) {

    if (pontuados[ix].scout != null) {

      Object.keys(pontuados[ix].scout).forEach(id => {

        const objScout = {
          result: pontuados[ix].scout[id] + id,
          atleta_id: pontuados[ix].atleta_id,
          apelido: pontuados[ix].apelido,
          sigla_id: id,
          qtde: pontuados[ix].scout[id],
          tipo: 'X',
          numero_rodada: numeroRodada
        };

        scoutJogador.push(objScout);


        if (scoutJogador[idx].sigla_id === 'DS'
          || scoutJogador[idx].sigla_id === 'G'
          || scoutJogador[idx].sigla_id === 'A'
          || scoutJogador[idx].sigla_id === 'SG'
          || scoutJogador[idx].sigla_id === 'FS'
          || scoutJogador[idx].sigla_id === 'FF'
          || scoutJogador[idx].sigla_id === 'FD'
          || scoutJogador[idx].sigla_id === 'FT'
          || scoutJogador[idx].sigla_id === 'PS'
          || scoutJogador[idx].sigla_id === 'DE'
          || scoutJogador[idx].sigla_id === 'DP') {
          scoutJogador[idx].tipo = 'P';
        } else {
          scoutJogador[idx].tipo = 'N';
        }

        /* Gravar tabela de scout  */
        gravarScoutJogador(scoutJogador[idx]);

        idx = idx + 1

      });

    }

  }

}

const gravarScoutJogador = async (objScout) => {

  //Gravar scout
  const scout_atleta = new Scout_Atleta({ ...objScout });
  scout_atleta.save();

}

const atualizarTabelaAtletasPontuados = async (pontuados) => {

  for (let a = 0; a < pontuados.length; a++) {

    const scoutDetalhe = {
      qtdeGols: 0,
      qtdeAssistencia: 0,
      qtdeCartaoAmarelo: 0,
      qtdeCartaoVermelho: 0,
      qtdeGolContra: 0,
      saldoGol: false
    }

    const partidaAtleta = {
      clube_casa_id: null,
      placar_oficial_mandante: null,
      abreviacaoMandante: null,
      clube_visitante_id: null,
      placar_oficial_visitante: null,
      abreviacaoVisitante: null,
      status_transmissao_tr: null
    }

    scoutJogadorTempPositivo = [];
    scoutJogadorTempNegativo = [];


    scoutAtleta = await sequelize.query(" select `scout_atleta`.`sigla_id`, `scout_atleta`.`qtde`, concat(`scout_atleta`.`qtde`, `scout_atleta`.`sigla_id`) as `result`  " +
      "      FROM `scout_atleta` " +
      "      WHERE `scout_atleta`.`atleta_id` " + `= "${pontuados[a].atleta_id}" ` +
      "      AND `scout_atleta`.`numero_rodada` " + `= "${numeroRodada}" `
      , {
        type: sequelize.QueryTypes.SELECT
      });


    if (scoutAtleta.length > 0) {

      for (i = 0; i < scoutAtleta.length; i++) {

        if (scoutAtleta[i].sigla_id === 'DS'
          || scoutAtleta[i].sigla_id === 'G'
          || scoutAtleta[i].sigla_id === 'A'
          || scoutAtleta[i].sigla_id === 'SG'
          || scoutAtleta[i].sigla_id === 'FS'
          || scoutAtleta[i].sigla_id === 'FF'
          || scoutAtleta[i].sigla_id === 'FD'
          || scoutAtleta[i].sigla_id === 'FT'
          || scoutAtleta[i].sigla_id === 'PS'
          || scoutAtleta[i].sigla_id === 'DE'
          || scoutAtleta[i].sigla_id === 'DP') {

          scoutJogadorTempPositivo.push(scoutAtleta[i].result);

          if (scoutAtleta[i].sigla_id === 'G') {
            scoutDetalhe.qtdeGols = scoutDetalhe.qtdeGols + scoutAtleta[i].qtde;
          }
          if (scoutAtleta[i].sigla_id === 'A') {
            scoutDetalhe.qtdeAssistencia = scoutDetalhe.qtdeAssistencia + scoutAtleta[i].qtde;
          }
          if (scoutAtleta[i].sigla_id === 'SG') {
            scoutDetalhe.saldoGol = true;
          }

        } else {
          scoutJogadorTempNegativo.push(scoutAtleta[i].result);
          if (scoutAtleta[i].sigla_id === 'CA') {
            scoutDetalhe.qtdeCartaoAmarelo = scoutDetalhe.qtdeCartaoAmarelo + scoutAtleta[i].qtde;
          }
          if (scoutAtleta[i].sigla_id === 'CV') {
            scoutDetalhe.qtdeCartaoVermelho = scoutDetalhe.qtdeCartaoVermelho + scoutAtleta[i].qtde;
          }
          if (scoutAtleta[i].sigla_id === 'GC') {
            scoutDetalhe.qtdeGolContra = scoutDetalhe.qtdeGolContra + scoutAtleta[i].qtde;
          }

        }

      }

      var scoutPos = scoutJogadorTempPositivo.toString();
      var scoutNeg = scoutJogadorTempNegativo.toString();


      Atleta_Pontuado.update(

        {
          scoutPositivo: scoutPos,
          scoutNegativo: scoutNeg,
          qtde_gols: scoutDetalhe.qtdeGols,
          qtde_assistencia: scoutDetalhe.qtdeAssistencia,
          qtde_cartao_amarelo: scoutDetalhe.qtdeCartaoAmarelo,
          qtde_cartao_vermelho: scoutDetalhe.qtdeCartaoVermelho,
          qtde_gol_contra: scoutDetalhe.qtdeGolContra,
          saldo_gol: scoutDetalhe.saldoGol,
        },
        {
          where: {
            numero_rodada: numeroRodada,
            atleta_id: pontuados[a].atleta_id
          }
        }

      )

    }




    /* Recuprar jogos por atleta  */
    for (ix = 0; ix < partidas.length; ix++) {
      if (partidas[ix].clube_casa_id === pontuados[a].clube_id || partidas[ix].clube_visitante_id === pontuados[a].clube_id) {
        /* Mandante */
        partidaAtleta.placar_oficial_mandante = partidas[ix].placar_oficial_mandante;
        partidaAtleta.abreviacaoMandante = partidas[ix].abreviacaoMandante;
        partidaAtleta.clube_casa_id = partidas[ix].clube_casa_id;
        /* Visitante */
        partidaAtleta.placar_oficial_visitante = partidas[ix].placar_oficial_visitante;
        partidaAtleta.abreviacaoVisitante = partidas[ix].abreviacaoVisitante;
        partidaAtleta.clube_visitante_id = partidas[ix].clube_visitante_id;
        /* Situação da partida */
        partidaAtleta.status_transmissao_tr = partidas[ix].status_transmissao_tr
      }
    }

    Atleta_Pontuado.update(
      {
        clube_casa_id: partidaAtleta.clube_casa_id,
        placar_oficial_mandante: partidaAtleta.placar_oficial_mandante,
        abreviacao_mandante: partidaAtleta.abreviacaoMandante,
        clube_visitante_id: partidaAtleta.clube_visitante_id,
        placar_oficial_visitante: partidaAtleta.placar_oficial_visitante,
        abreviacao_visitante: partidaAtleta.abreviacaoVisitante,
        status_transmissao_tr: partidaAtleta.status_transmissao_tr,
      },
      {
        where: {
          numero_rodada: numeroRodada,
          atleta_id: pontuados[a].atleta_id
        }
      }
    )
  }
}

const atualizarSubstituiçãoBancoReservas = async (numeroRodada) => {

  /* Atualizar banco de reservas */

  arrayAtletaBancoEntrou = [];
      arrayAtletaBancoSaiu = [];

  timesEscalacao = await sequelize.query(" SELECT distinct `time_id`  " +
    " FROM `escalacao_time_rodada`  " +
    " where  `numero_rodada` " + `= "${numeroRodada}" `
    , {
      type: sequelize.QueryTypes.SELECT
    });

  if (timesEscalacao.length > 0) {

    for (x = 0; x < timesEscalacao.length; x++) {
      path = `/time/substituicoes/${timesEscalacao[x].time_id}/${numeroRodada}`;
      var url = `${BASE_URL}${path}`;

      

      substituicao = await unirest.get(url)
        .header(
          "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
          "Accept", "application/json, text/plain, */*",
          "Referer", "https://cartolafc.globo.com/",
          "Origin", "https://cartolafc.globo.com/",
          "Accept-Language", "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2"
        )

      if (substituicao) {

        /* Atleta entrou */
        Object.keys(substituicao.body).forEach(entrou => {
          const atleta_entrou = {
            numero_rodada: numeroRodada,
            time_id: timesEscalacao[x].time_id,
            atleta_id: substituicao.body[entrou].entrou.atleta_id,
            entrou: true,
            saiu: false
          };
          arrayAtletaBancoEntrou.push(atleta_entrou);
        });

        for (let ii = 0; ii < arrayAtletaBancoEntrou.length; ii++) {
          /* Gravar tabela de escalacao time titular  */  

            Substituicao_Time_Rodada.findOne({
            where: {
              numero_rodada: numeroRodada,
              time_id: arrayAtletaBancoEntrou[ii].time_id,
              atleta_id: arrayAtletaBancoEntrou[ii].atleta_id
            }
          }).then(listado => {
            if (listado === null) {
              const substituicao_time_rodada = new Substituicao_Time_Rodada({ ...arrayAtletaBancoEntrou[ii] });
              substituicao_time_rodada.save();
            } else {
              Substituicao_Time_Rodada.update({
                entrou: arrayAtletaBancoEntrou[ii].entrou,
                saiu: arrayAtletaBancoEntrou[ii].saiu
              },
                {
                  where: {
                    numero_rodada: numeroRodada,
                    time_id: arrayAtletaBancoEntrou[ii].time_id,
                    atleta_id: arrayAtletaBancoEntrou[ii].atleta_id
                  }
                });
            }
          });

        }

        /* Atleta saiu */
        Object.keys(substituicao.body).forEach(saiu => {
          const atleta_saiu = {
            numero_rodada: numeroRodada,
            time_id: timesEscalacao[x].time_id,
            atleta_id: substituicao.body[saiu].saiu.atleta_id,
            saiu: true,
            entrou: false,
          };
          arrayAtletaBancoSaiu.push(atleta_saiu);
        });

        for (let ii = 0; ii < arrayAtletaBancoSaiu.length; ii++) {
          /* Gravar tabela de escalacao time titular  */
          Substituicao_Time_Rodada.findOne({
            where: {
              numero_rodada: numeroRodada,
              time_id: arrayAtletaBancoSaiu[ii].time_id,
              atleta_id: arrayAtletaBancoSaiu[ii].atleta_id
            }
          }).then(listado => {
            if (listado === null) {
              const substituicao_time_rodada = new Substituicao_Time_Rodada({ ...arrayAtletaBancoSaiu[ii] });
              substituicao_time_rodada.save();
            } else {
              Substituicao_Time_Rodada.update({
                entrou: arrayAtletaBancoSaiu[ii].entrou,
                saiu: arrayAtletaBancoSaiu[ii].saiu
              },
                {
                  where: {
                    numero_rodada: numeroRodada,
                    time_id: arrayAtletaBancoSaiu[ii].time_id,
                    atleta_id: arrayAtletaBancoSaiu[ii].atleta_id
                  }
                });
            }
          });
        }
      }

    }

  }

}

const recuperarSituacaoPartidas = async () => {

  path = `/partidas/${numeroRodada}`;
  var url = `${BASE_URL}${path}`;
  clubesArray = [];
  partidasArray = [];
  escudoTime = [];

  resultJson = await unirest.get(url)
    .header(
      "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
      "Accept", "application/json, text/plain, */*",
      "Referer", "https://cartolafc.globo.com/",
      "Origin", "https://cartolafc.globo.com/",
      "Accept-Language", "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2"
    )


  if (resultJson.body) {

    partidasArray = resultJson.body.partidas;

    Object.keys(resultJson.body.clubes).forEach(id => {
      const clubes = {
        id: id,
        nome: resultJson.body.clubes[id].nome,
        abreviacao: resultJson.body.clubes[id].abreviacao,
        escudos: resultJson.body.clubes[id].escudos,
        nome_fantasia: resultJson.body.clubes[id].nome_fantasia
      };
      clubesArray.push(clubes);

    });

    // Juntar array de times com array de partidas
    for (let i = 0; i < partidasArray.length; i++) {
      partidasArray[i].horaPartida = partidasArray[i].partida_data.substring(11, 16);
      var partidaMM = partidasArray[i].partida_data.substring(5, 7);
      var partidaDD = partidasArray[i].partida_data.substring(8, 10);
      partidasArray[i].dataPartida = partidaDD + '/' + partidaMM;

      for (let x = 0; x < clubesArray.length; x++) {

        // Recuperar link do escudo 30x30
        Object.keys(clubesArray[x].escudos).forEach(id => {
          const brasao = {
            id: id,
            link: clubesArray[x].escudos[id]
          };
          if (id === '30x30') {
            escudoTime.push(brasao);
          }
        });

        /* Tratar status da partida */
        if (partidasArray[i].status_transmissao_tr === 'CRIADA') {
          partidasArray[i].status_transmissao_tr = 'À iniciar';
        } else {
          if (partidasArray[i].status_transmissao_tr === 'ENCERRADA') {
            partidasArray[i].status_transmissao_tr = 'Encerrada'
          } else {
            if (partidasArray[i].status_transmissao_tr === 'EM_ANDAMENTO') {
              if (partidasArray[i].periodo_tr === 'INTERVALO') {
                partidasArray[i].status_transmissao_tr = 'Intervalo';
              } else {
                if (partidasArray[i].periodo_tr === 'PRE_JOGO') {
                  partidasArray[i].status_transmissao_tr = 'À iniciar';
                } else {
                  partidasArray[i].status_transmissao_tr = 'Em andamento';
                }
              }
            }
          }
        }


        if (Number(partidasArray[i].clube_casa_id) === Number(clubesArray[x].id)) {
          partidasArray[i].nomeMandante = clubesArray[x].nome;
          partidasArray[i].abreviacaoMandante = clubesArray[x].abreviacao;
          partidasArray[i].escudosMandante = escudoTime[x].link /* clubesArray[x].escudos */;
          partidasArray[i].nome_fantasiaMandante = clubesArray[x].nome_fantasia;
        }
        if (Number(partidasArray[i].clube_visitante_id) === Number(clubesArray[x].id)) {
          partidasArray[i].nomeVisitante = clubesArray[x].nome;
          partidasArray[i].abreviacaoVisitante = clubesArray[x].abreviacao;
          partidasArray[i].escudosVisitante = escudoTime[x].link /* clubesArray[x].escudos */;
          partidasArray[i].nome_fantasiaVisitante = clubesArray[x].nome_fantasia;

        }
      }
    }
    return partidasArray;
  }

}



const putParciasAtletasTimes = async (numeroRodada) => {

  var path = '';
  var url = '';

  timesCartola = await sequelize.query(" SELECT distinct `a`.`time_id` as `time_id_OK`, " +
    " `b`.`time_id` FROM `time_cartola` `a` " +
    " left outer join `escalacao_time_rodada` `b` " +
    " on   `b`.`time_id` = `a`.`time_id` " +
    " and  `b`.`numero_rodada` " + `= "${numeroRodada}" ` +
    " where `b`.`time_id` is null "
    , {
      type: sequelize.QueryTypes.SELECT
    });

  if (timesCartola.length > 0) {

    for (x = 0; x < timesCartola.length; x++) {

      path = `/time/id/${timesCartola[x].time_id_OK}`;
      url = `${BASE_URL}${path}`;


      atletasArray = [];
      atletasArrayReservas = [];

      // consultarTimeCartola
      resultJson = await unirest.get(url)
        .header(
          "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
          "Accept", "application/json, text/plain, */*",
          "Referer", "https://cartolafc.globo.com/",
          "Origin", "https://cartolafc.globo.com/",
          "Accept-Language", "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2"
        )

      if (resultJson.body) {

        //     var numeroRodada = resultJson.body.rodada_atual;

        if (resultJson.body.atletas != undefined) {


          let idx = 0;
          Object.keys(resultJson.body.atletas).forEach(atleta_id => {

            const atleta = {
              time_id: timesCartola[x].time_id_OK,
              numero_rodada: numeroRodada,
              atleta_id: resultJson.body.atletas[atleta_id].atleta_id,
              posicao_id: resultJson.body.atletas[atleta_id].posicao_id,
              atleta_titular: true
            };

            atletasArray.push(atleta);

            if (resultJson.body.capitao_id === resultJson.body.atletas[idx].atleta_id) {
              atletasArray[idx].atleta_capitao = true;
            } else {
              atletasArray[idx].atleta_capitao = false;
            }

            idx = idx + 1

          });

          atletasArray.sort((a, b) => a['posicao_id'] - b['posicao_id']);


          for (let ix = 0; ix < atletasArray.length; ix++) {
            /* Gravar tabela de escalacao time titular  */
            const escalacao_time_rodada = new Escalacao_Time_Rodada({ ...atletasArray[ix] });
            escalacao_time_rodada.save();
          }

          if (resultJson.body.reservas != undefined) {

            Object.keys(resultJson.body.reservas).forEach(atleta_id => {

              const atletaReserva = {
                time_id: timesCartola[x].time_id_OK,
                numero_rodada: numeroRodada,
                atleta_id: resultJson.body.reservas[atleta_id].atleta_id,
                posicao_id: resultJson.body.reservas[atleta_id].posicao_id,
                atleta_titular: false,
                atleta_capitao: false
              };

              atletasArrayReservas.push(atletaReserva);

            });

            for (let ii = 0; ii < atletasArrayReservas.length; ii++) {
              /* Gravar tabela de escalacao time titular  */
              const escalacao_time_rodada = new Escalacao_Time_Rodada({ ...atletasArrayReservas[ii] });
              escalacao_time_rodada.save();
            }
          }
        }

        /* Atualizar banco de reservas */

        path = `/time/substituicoes/${timesCartola[x].time_id_OK}/${numeroRodada}`;
        var url = `${BASE_URL}${path}`;

        arrayAtletaBancoEntrou = [];
        arrayAtletaBancoSaiu = [];

        substituicao = await unirest.get(url)
          .header(
            "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
            "Accept", "application/json, text/plain, */*",
            "Referer", "https://cartolafc.globo.com/",
            "Origin", "https://cartolafc.globo.com/",
            "Accept-Language", "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2"
          )

        if (substituicao) {

          /* Atleta entrou */
          Object.keys(substituicao.body).forEach(entrou => {
            const atleta_entrou = {
              numero_rodada: numeroRodada,
              time_id: timesCartola[x].time_id_OK,
              atleta_id: substituicao.body[entrou].entrou.atleta_id,
              entrou: true,
              saiu: false
            };
            arrayAtletaBancoEntrou.push(atleta_entrou);
          });

          for (let ii = 0; ii < arrayAtletaBancoEntrou.length; ii++) {
            /* Gravar tabela de escalacao time titular  */
            const substituicao_time_rodada = new Substituicao_Time_Rodada({ ...arrayAtletaBancoEntrou[ii] });
            substituicao_time_rodada.save();
          }

          /* Atleta saiu */
          Object.keys(substituicao.body).forEach(saiu => {
            const atleta_saiu = {
              numero_rodada: numeroRodada,
              time_id: timesCartola[x].time_id_OK,
              atleta_id: substituicao.body[saiu].saiu.atleta_id,
              saiu: true,
              entrou: false,
            };
            arrayAtletaBancoSaiu.push(atleta_saiu);
          });

          for (let ii = 0; ii < arrayAtletaBancoSaiu.length; ii++) {
            /* Gravar tabela de escalacao time titular  */
            const substituicao_time_rodada = new Substituicao_Time_Rodada({ ...arrayAtletaBancoSaiu[ii] });
            substituicao_time_rodada.save();
          }
        }

      }



    }

    return atletasArray;
  }

}


const putParciasTimes = async (numero_rodada, id_competicao) => {

  timesCartola = await sequelize.query(" SELECT `A`.`time_id` " +
    " , sum(`E`.`pontuacao`) as `pontuacao_sem_capitao` " +
    " , sum(CASE WHEN `C`.`atleta_capitao` = true THEN `E`.`pontuacao` * 2 " +
    " else `E`.`pontuacao` end ) as `pontuacao_com_capitao` " +
    " FROM `time_cartola` `A`" +

    "INNER JOIN `time_competicao` `B` " +
    "  ON `B`.`time_id` = `A`.`time_id`" +

    " INNER JOIN `escalacao_time_rodada` `C` " +
    " ON  `C`.`numero_rodada` = `B`.`numero_rodada` " +
    " and `C`.`time_id`       = `B`.`time_id` " +

    " LEFT OUTER JOIN `substituicao_time_rodada` `D`" +
    " ON  `D`.`numero_rodada` = `C`.`numero_rodada`" +
    " and `D`.`time_id`       = `C`.`time_id`" +
    " and `D`.`atleta_id`     = `C`.`atleta_id`" +

    " INNER JOIN `atleta_pontuado` `E`" +
    " ON  `E`.`atleta_id`     = `C`.`atleta_id` " +
    " and `E`.`numero_rodada` = `B`.`numero_rodada` " +


    " WHERE `B`.`numero_rodada` " + `= "${numero_rodada}" ` +
    " AND   `B`.`id_competicao` " + `= "${id_competicao}" ` +

    " and (( `d`.`time_id` is not null " +
    "   and   `d`.`entrou` = true) " +
    "   or    ( `c`.`atleta_titular` = true " +
    "   and   `d`.`time_id` is null)) " +

    "  group by `A`.`time_id` " +
    " order by `pontuacao_com_capitao` desc "
    , {
      type: sequelize.QueryTypes.SELECT
    });


  if (timesCartola.length > 0) {

    for (x = 0; x < timesCartola.length; x++) {


      qt_atleta_pontuado = await sequelize.query("SELECT COUNT(*) as `count` " +
        " FROM  `escalacao_time_rodada` `A` " +
        "  LEFT OUTER JOIN `substituicao_time_rodada` `B` " +
        " ON  `B`.`numero_rodada` = `A`.`numero_rodada` " +
        " and `B`.`time_id`       = `A`.`time_id` " +
        " and `B`.`atleta_id`     = `A`.`atleta_id` " +
        " INNER JOIN `atleta_pontuado` `C` " +
        " ON  `C`.`atleta_id` = `A`.`atleta_id` " +
        " and `C`.`numero_rodada` = `A`.`numero_rodada` " +
        " WHERE `A`.`numero_rodada`  " + `= "${numero_rodada}" ` +
        " and   `A`.`time_id` " + `= "${timesCartola[x].time_id}" ` +
        " and   ( `C`.`posicao_id` <> 6 " +
        "        or  `C`.`pontuacao` <> 0 ) " +
        " and (( `B`.`time_id` is not null " +
        " and   `B`.`entrou` = true) " +
        " or    ( `A`.`atleta_titular` = true " +
        " and   `B`.`time_id` is null)) "
        , {
          type: sequelize.QueryTypes.SELECT
        });

      timesCartola[x].qtde_jogador_pontuado = qt_atleta_pontuado[0].count;

      Time_Competicao.update(

        {
          pontuacao_rodada: timesCartola[x].pontuacao_com_capitao,
          pontuacao_rodada_sem_capitao: timesCartola[x].pontuacao_sem_capitao,
          qtde_jogador_pontuado: timesCartola[x].qtde_jogador_pontuado
        },
        {
          where: {
            numero_rodada: numero_rodada,
            id_competicao: id_competicao,
            time_id: timesCartola[x].time_id
          }
        }

      )

    }

  }

  return timesCartola;

}

const getParciaisAtletasRodada = async (numero_rodada) => {
  return atletas = await Atleta_Pontuado.findAll({
    where: { numero_rodada: numero_rodada },
    order: [
      ['pontuacao', 'DESC']
    ],
  })
}


const putMercadoAtletas = async () => {

  path = `/atletas/mercado`;
  var url = `${BASE_URL}${path}`;
  arrayMercadoAtletas = [];

  dadosMercadoAtletas = await unirest.get(url)
    .header(
      "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
      "Accept", "application/json, text/plain, */*",
      "Referer", "https://cartolafc.globo.com/",
      "Origin", "https://cartolafc.globo.com/",
      "Accept-Language", "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2"
    )



  if (dadosMercadoAtletas.body) {

    Object.keys(dadosMercadoAtletas.body.atletas).forEach(atleta_id => {
      const mercadoAtleta = {
        atleta_id: dadosMercadoAtletas.body.atletas[atleta_id].atleta_id,
        apelido: dadosMercadoAtletas.body.atletas[atleta_id].apelido,
        foto: dadosMercadoAtletas.body.atletas[atleta_id].foto,
        posicao_id: dadosMercadoAtletas.body.atletas[atleta_id].posicao_id,
        clube_id: dadosMercadoAtletas.body.atletas[atleta_id].clube_id,
      };

      if (mercadoAtleta.foto != null) {
        mercadoAtleta.foto = mercadoAtleta.foto.replace('FORMATO', '140x140');
      }


      arrayMercadoAtletas.push(mercadoAtleta);



    });

    for (x = 0; x < arrayMercadoAtletas.length; x++) {

      const atletas = {
        atleta_id: arrayMercadoAtletas[x].atleta_id,
        apelido: arrayMercadoAtletas[x].apelido,
        foto: arrayMercadoAtletas[x].foto,
        posicao_id: arrayMercadoAtletas[x].posicao_id,
        clube_id: arrayMercadoAtletas[x].clube_id,
      };

      Atleta.findOne({ where: { atleta_id: atletas.atleta_id } }).then(listado => {
        if (listado === null) {
          const atleta = new Atleta({ ...atletas });
          atleta.save();
        } else {
          Atleta.update({
            apelido: atletas.apelido,
            foto: atletas.foto,
            posicao_id: atletas.posicao_id,
            clube_id: atletas.clube_id
          },
            { where: { atleta_id: atletas.atleta_id } });
        }
      });
    }

    return arrayMercadoAtletas;

  }

}



module.exports = {
  putAtletasPontuados,
  putParciasAtletasTimes,
  putParciasTimes,
  getParciaisAtletasRodada,
  putMercadoAtletas

};
