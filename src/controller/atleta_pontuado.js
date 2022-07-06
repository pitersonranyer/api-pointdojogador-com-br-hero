const {
  getAtletasPontuados
} = require('../repository/atleta_pontuado');


const listarAtletasPontuados = async  (req, res, next) => {
  const numero_rodada = req.params.numero_rodada;
  return getAtletasPontuados( numero_rodada )
    .then(atletas => res.json(atletas))
    .catch(err => next(err));
};


module.exports = {
  listarAtletasPontuados
};

