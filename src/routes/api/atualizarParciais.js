const Router = require('express').Router();
const controller = require('../../controller/atualizarParciais');

Router.get('/atualizarAtletasPontuados/:numero_rodada', controller.atualizarAtletasPontuados);
Router.get('/atualizarParciasAtletasTimes/:numero_rodada', controller.atualizarParciasAtletasTimes);
Router.get('/atualizarBancoReservasTimes/:time_id', controller.atualizarBancoReservasTimes);
Router.get('/atualizarParciasTimes/:numero_rodada/:id_competicao', controller.atualizarParciasTimes);
Router.get('/listarParciaisAtletasRodada/:numero_rodada', controller.listarParciaisAtletasRodada);


module.exports = Router;

