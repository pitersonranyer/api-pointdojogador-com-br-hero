const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');
const controller = require('../../controller/cartolaAPI');


Router.get('/listarTimesCartola/:time',  controller.listarTimesCartola);
Router.get('/consultarMercadoStatus/', controller.consultarMercadoStatus);
Router.get('/consultarTimeCartola/:idTime',  controller.consultarTimeCartola);
Router.get('/consultarPartidas/:nrRodada',  controller.consultarPartidas);


module.exports = Router;