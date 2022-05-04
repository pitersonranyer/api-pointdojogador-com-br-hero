const {
  cadastrarAtleta
} = require('../repository/dadoMestreCartola');

const cadastro = (req, res, next) => {
  const dadosAtleta = req.body;
  return cadastrarAtleta(dadosAtleta)
    .then(atleta => {
      if (!atleta) {
        return res.status(409).end();
      }
      return res.status(200).end();
    })
    .catch(error => next(error));
};


module.exports = {
  cadastro
};

