const {
  putAtletasPontuados ,
  putParciasAtletasTimes,
  putParciasTimes,
  getParciaisAtletasRodada,
  putMercadoAtletas
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

 const atualizarMercadoAtletas = async (req, res, next) => {

 return putMercadoAtletas()
     .then(mercadoAtleta => res.json(mercadoAtleta))
     .catch(err => next(err));
 };


 

module.exports = {
  atualizarAtletasPontuados,
  atualizarParciasAtletasTimes,
  atualizarParciasTimes,
  listarParciaisAtletasRodada,
  atualizarMercadoAtletas

};