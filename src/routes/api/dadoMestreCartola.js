const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');

const controller = require('../../controller/dadoMestreCartola');

Router.post('/',  controller.cadastro);


module.exports = Router;
