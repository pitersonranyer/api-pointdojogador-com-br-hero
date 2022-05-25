const Router = require('express').Router();
const controller = require('../../controller/atualizarParciais');

Router.get('/atualizarAtletasPontuados/:numero_rodada', controller.atualizarAtletasPontuados);
Router.get('/atualizarParciasAtletasTimes/:time_id', controller.atualizarParciasAtletasTimes);


module.exports = Router;

