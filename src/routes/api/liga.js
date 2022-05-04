const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');

const controller = require('../../controller/liga');

Router.post('/',  controller.cadastro);

Router.get('/listarTodasLigas',  controller.listarTodasLigas);

Router.delete('/excluirLiga/:id_liga',   controller.excluirLiga);

module.exports = Router;
