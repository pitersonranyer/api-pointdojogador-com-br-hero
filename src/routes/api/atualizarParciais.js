const Router = require('express').Router();
const controller = require('../../controller/atualizarParciais');

Router.get('/atualizarParciais/:numero_rodada', controller.atualizarParciais);

module.exports = Router;

