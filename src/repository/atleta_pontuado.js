const Atleta_pontuado = require('../model/atleta_pontuado');
const sequelize = require('../database/database');

const getAtletasPontuados = async (numero_rodada) => {

  result = await sequelize.query("Select `a`.`numero_rodada` " +
    ", `a`.`atleta_id` " +
    ", `a`.`clube_id` " +
    ", `a`.`posicao_id` " +
    ", `a`.`apelido` " +
    ", `a`.`foto` " +
    ", `a`.`pontuacao` " +
    ", `a`.`entrou_em_campo` " +
    ", `a`.`scoutPositivo` " +
    ", `a`.`scoutNegativo` " +
    ", `a`.`qtde_gols` " +
    ", `a`.`qtde_assistencia` " +
    ", `a`.`qtde_cartao_amarelo` " +
    ", `a`.`qtde_cartao_vermelho` " +
    ", `a`.`qtde_gol_contra` " +
    ", `a`.`saldo_gol` " +
    ", `a`.`clube_casa_id` " +
    ", `a`.`placar_oficial_mandante` " +
    ", `a`.`abreviacao_mandante` " +
    ", `a`.`clube_visitante_id` " +
    ", `a`.`placar_oficial_visitante` " +
    ", `a`.`abreviacao_visitante` " +
    ", `a`.`status_transmissao_tr` " +
    "from `atleta_pontuado` `a` " +
    "where `a`.`numero_rodada` =  " + `${numero_rodada} ` +
    "order by `a`.`pontuacao` desc "
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
  getAtletasPontuados
};
