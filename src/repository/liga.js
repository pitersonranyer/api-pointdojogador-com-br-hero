const Liga = require('../model/liga');
const sequelize = require('../database/database');


const cadastrarliga = dadosLiga => {
  return Liga.max('id_liga').then(max => {
    if (Number.isNaN(max)) {
      max = 0;
      const numMax = max + 1;
      dadosLiga.id_liga = numMax;
      const liga = new Liga({ ...dadosLiga });
      liga.save();
      return true;
    } else {
      const numMax = max + 1;
      dadosLiga.id_liga = numMax;
      const liga = new Liga({ ...dadosLiga });
      liga.save();
      return true;
    }
  });


};

const getTodasLigas = () => {
  return Liga.findAll()
    .then(data => {
      if (data === null) {
        return false;
      } else {
        return data;
      }
    });
};



const deleteLiga = (id_liga) => {
  return Liga.destroy({
    where:
    {
      id_liga: id_liga
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



module.exports = {
  cadastrarliga,
  getTodasLigas,
  deleteLiga,
};
