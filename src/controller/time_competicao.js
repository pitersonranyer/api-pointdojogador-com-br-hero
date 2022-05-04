const {
  cadastrarTimeCompeticao
} = require('../repository/time_competicao');

const cadastro = (req, res, next) => {
  const dadosTimeCompeticao = req.body;
  return cadastrarTimeCompeticao(dadosTimeCompeticao)
    .then(timeCompeticao => {
      if (!timeCompeticao) {
        return res.status(409).end();
      }
      return res.status(200).end();
    })
    .catch(error => next(error));
};


module.exports = {
  cadastro
};

