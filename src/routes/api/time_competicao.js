const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');

const controller = require('../../controller/time_competicao');

Router.post('/',  controller.cadastro);

Router.get('/listarTimesDaCompeticao/:id_competicao/:numero_rodada_atual', controller.listarTimesDaCompeticao);


module.exports = Router;
