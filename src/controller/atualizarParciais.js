const {
  putAtletasPontuados ,
  putParciasAtletasTimes
} = require('../repository/atualizarParciais');


const atualizarAtletasPontuados = async (req, res, next) => {
  const numero_rodada = req.params.numero_rodada
  return putAtletasPontuados(numero_rodada)
    .then(atu => res.json(atu))
    .catch(err => next(err));
};


const atualizarParciasAtletasTimes = async (req, res, next) => {
 
 return putParciasAtletasTimes()
    .then(atletas => res.json(atletas))
    .catch(err => next(err));
};


module.exports = {
  atualizarAtletasPontuados,
  atualizarParciasAtletasTimes
};