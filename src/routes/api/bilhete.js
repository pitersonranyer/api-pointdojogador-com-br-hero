const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');

const controller = require('../../controller/bilhete');

Router.post('/',  controller.cadastro);


module.exports = Router;
