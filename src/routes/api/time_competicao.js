const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');

const controller = require('../../controller/time_competicao');

Router.post('/',  controller.cadastro);

Router.get('/listarTimesDaCompeticao/:id_competicao/:numero_rodada_atual', controller.listarTimesDaCompeticao);
Router.get('/listarAtletasTimeCompeticao/:time_id/:numero_rodada', controller.listarAtletasTimeCompeticao);
Router.get('/listarTimesBilhete/:numero_rodada/:id_competicao/:id_bilhete', controller.listarTimesBilhete);

module.exports = Router;
