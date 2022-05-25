const Router = require('express').Router();
const controller = require('../../controller/atualizarParciais');

Router.get('/atualizarAtletasPontuados/:numero_rodada', controller.atualizarAtletasPontuados);
Router.get('/atualizarParciasAtletasTimes', controller.atualizarParciasAtletasTimes);


module.exports = Router;

