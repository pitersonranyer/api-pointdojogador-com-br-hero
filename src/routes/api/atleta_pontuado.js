const Router = require('express').Router();
const { autenticarRequisicao } = require('../../middleware/auth');

const controller = require('../../controller/atleta_pontuado');

Router.get('/listarAtletasPontuados/:numero_rodada', controller.listarAtletasPontuados);


module.exports = Router;
