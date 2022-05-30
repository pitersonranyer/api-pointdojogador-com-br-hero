const {
  putAtletasPontuados ,
  putParciasAtletasTimes,
  putBancoReservasTimes,
  putParciasTimes,
  getParciaisAtletasRodada
} = require('../repository/atualizarParciais');


const atualizarAtletasPontuados = async (req, res, next) => {
  const numero_rodada = req.params.numero_rodada;
  const statusMercado = req.params.statusMercado;
  return putAtletasPontuados(numero_rodada, statusMercado)
    .then(atu => res.json(atu))
    .catch(err => next(err));
};


const atualizarParciasAtletasTimes = async (req, res, next) => {

   const numeroRodada = req.params.numero_rodada
 
 return putParciasAtletasTimes(numeroRodada)
    .then(atletas => res.json(atletas))
    .catch(err => next(err));
};

const atualizarBancoReservasTimes = async (req, res, next) => {

  const time_id = req.params.time_id
 
  return putBancoReservasTimes(time_id)
     .then(banco => res.json(banco))
     .catch(err => next(err));
 };

 const atualizarParciasTimes = async (req, res, next) => {

  const numero_rodada = req.params.numero_rodada;
  const id_competicao = req.params.id_competicao;

 return putParciasTimes(numero_rodada, id_competicao )
     .then(times => res.json(times))
     .catch(err => next(err));
 };

 const listarParciaisAtletasRodada = async (req, res, next) => {

  const numero_rodada = req.params.numero_rodada;

 return getParciaisAtletasRodada(numero_rodada )
     .then(times => res.json(times))
     .catch(err => next(err));
 };


 getParciaisAtletasRodada


module.exports = {
  atualizarAtletasPontuados,
  atualizarParciasAtletasTimes,
  atualizarBancoReservasTimes,
  atualizarParciasTimes,
  listarParciaisAtletasRodada

};