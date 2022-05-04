const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');

const controller = require('../../controller/time_competicao');

Router.post('/',  controller.cadastro);


module.exports = Router;
