const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');

const controller = require('../../controller/competicao');

Router.post('/', autenticarRequisicao,  controller.cadastro);

Router.delete('/excluirCompeticaoPorId/:id_competicao', autenticarRequisicao,  controller.excluirCompeticaoPorId);

Router.put('/alterarCompeticao', autenticarRequisicao, controller.alterarCompeticao);

Router.get('/listarCompeticao',  controller.listarTodasCompeticoes);

Router.get('/listarCompeticaoAtivas',  controller.listarCompeticaoAtivas);

Router.get('/listarBilheteCompeticaoGerado',  controller.listarBilheteCompeticaoGerado);


module.exports = Router;
