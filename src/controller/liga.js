const {
  cadastrarliga,
  getTodasLigas,
  deleteLiga,
} = require('../repository/liga');

const cadastro = (req, res, next) => {
  const dadosLiga = req.body;
  return cadastrarliga(dadosLiga)
    .then(liga => {
      if (!liga) {
        return res.status(409).end();
      }

      return res.status(200).end();
    })
    .catch(error => next(error));
};

const listarTodasLigas = (req, res, next) => {
  return getTodasLigas()
    .then(ligas => res.json(ligas))
    .catch(err => next(err));
};




const excluirLiga = (req, res, next) => {

  const id_liga = req.params.id_liga;

  return deleteLiga(id_liga)
    .then(liga => {
      if (!liga) {
        return res.status(404).end();
      }
      return res.status(200).end();
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
};

module.exports = {
  cadastro,
  listarTodasLigas,
  excluirLiga
};

