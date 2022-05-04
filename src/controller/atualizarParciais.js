const {
  atualizarAtletaPontuado } = require('../repository/atualizarParciais');

const atualizarParciais = async (req, res, next) => {
  
  const numero_rodada = req.params.numero_rodada

  return atualizarAtletaPontuado(numero_rodada)

    .then(atu => res.json(atu))
    .catch(err => next(err));
};


module.exports = {
  atualizarParciais
};