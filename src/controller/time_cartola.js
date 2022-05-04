const {
  cadastrarTimeCartola
} = require('../repository/time_cartola');

const cadastro = (req, res, next) => {
  const dadosTimeCartola = req.body;
  return cadastrarTimeCartola(dadosTimeCartola)
    .then(timeCartola => {
      if (!timeCartola) {
        return res.status(409).end();
      }
      return res.status(200).end();
    })
    .catch(error => next(error));
};


module.exports = {
  cadastro
};

