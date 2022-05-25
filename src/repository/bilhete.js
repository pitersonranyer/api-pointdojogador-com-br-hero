const Bilhete = require('../model/bilhete');
const Time_Competicao = require('../model/time_competicao');
const sequelize = require('../database/database');

let data = new Date();
let anoAtual = data.getFullYear();

const cadastrarBilhete = async dadosBilhete => {

  max = await sequelize.query("SELECT max(id_bilhete)  as `max` " +
    "FROM `bilhete` "

    , {
      type: sequelize.QueryTypes.SELECT
    });

  if ((max[0].max === null)) {
    let numbersAsString = `${anoAtual}${'00000'}`;
    max[0].max = numbersAsString;
    const numMax = max[0].max + 1;
    dadosBilhete.id_bilhete = numMax;
  } else {
    const numMax = max[0].max + 1;
    dadosBilhete.id_bilhete = numMax;

  }

  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  let ticket_id = "pJ" + anoAtual + text;
  dadosBilhete.ticket_id = ticket_id;


  //Gravar bilhete
  dadosBilhete.status_atual_bilhete = 'Gerado';
  const bilhete = new Bilhete({ ...dadosBilhete });
  bilhete.save();


  const retDados = {
    id_bilhete: dadosBilhete.id_bilhete,
    ticket_id: dadosBilhete.ticket_id
  };

  return retDados;


};

const putStatusBilhete = dadosBilhete => {


  const id_bilhete = dadosBilhete.id_bilhete;
  const status_atual_bilhete = dadosBilhete.status_atual_bilhete;


  return Bilhete.update(
    { status_atual_bilhete: status_atual_bilhete },
    {
      where: {
        id_bilhete: id_bilhete
      }
    }
  ).then(function (updatedRecord) {
    if (updatedRecord) {
      if (dadosBilhete.status_atual_bilhete === 'Cancelado') {
        return Time_Competicao.destroy({
          where:
          {
            id_bilhete: id_bilhete
          }
        })
      }
      return true;
    }
    else {
      return false;
    }
  });
};


module.exports = {
  cadastrarBilhete,
  putStatusBilhete
};
