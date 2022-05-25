const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');

const controller = require('../../controller/bilhete');

Router.post('/',  autenticarRequisicao, controller.cadastro);

Router.put('/alterarStatusBilheteCompeticao', autenticarRequisicao, controller.alterarStatusBilheteCompeticao);


module.exports = Router;
