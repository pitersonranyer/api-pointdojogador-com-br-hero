var unirest = require("unirest");
var fs = require("fs");
const Scout_Atleta = require('../model/scout_atleta');
const Atleta_Pontuado = require('../model/atleta_pontuado');
const sequelize = require('../database/database');

const BASE_URL = 'https://api.cartolafc.globo.com';

var rodada = 0;

const atualizarAtletaPontuado = async (numero_rodada) => { // parciais

  rodada = numero_rodada;

  /* Recuperar lista de atletas pontuados */
  const pontuados = await recuperarAtletasPontuados();

  /* Recuperar resultados e situação de jogos no momento */
  partidas = await recuperarSituacaoPartidas();

  /* Deleta atletas para gravar novamente */
  await gerarAtletasPontuados(pontuados);

  /* Deleta scout para gravar novamente */
  await gerarScoutJogadores(pontuados);

  /* Atualizar tabela atletas  */
  await atualizarTabelaAtletasPontuados(pontuados);

}

const recuperarAtletasPontuados = async () => {

  path = `/atletas/pontuados/${rodada}`;
  var url = `${BASE_URL}${path}`;

  var arrayAtletasPontuados = [];


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
      arrayAtletasPontuados.push(atleta);

    });

    return arrayAtletasPontuados;

  }

}


const recuperarSituacaoPartidas = async () => {

  path = `/partidas/${rodada}`;
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


const gerarAtletasPontuados = async (pontuados) => {

  Atleta_Pontuado.destroy({
    where: {
      numero_rodada: rodada
    }
  });

  for (let ix = 0; ix < pontuados.length; ix++) {
    // Gravar tabela de atletas 
    gravarAtletas(pontuados[ix]);
  }
}

const gravarAtletas = async (objAtletas) => {
  objAtletas.numero_rodada = rodada;

  //Gravar atletas
  const atleta_pontuado = new Atleta_Pontuado({ ...objAtletas });
  atleta_pontuado.save();

}

const gerarScoutJogadores = async (pontuados) => {

  Scout_Atleta.destroy({
    where: {
      numero_rodada: rodada
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
          numero_rodada: rodada
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
      "      AND `scout_atleta`.`numero_rodada` " + `= "${rodada}" `
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
            numero_rodada: rodada,
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
          numero_rodada: rodada,
          atleta_id: pontuados[a].atleta_id
        }
      }
    )
  }
}


module.exports = {
  atualizarAtletaPontuado
};