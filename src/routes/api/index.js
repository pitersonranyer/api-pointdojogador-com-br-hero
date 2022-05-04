const Router = require('express').Router();

const authRouter = require('./auth');

const ligaRouter = require('./liga');
const competicaoRouter = require('./competicao');
const bilheteRouter = require('./bilhete');
const timeCompeticaoRouter = require('./time_competicao');
const timeCartolaRouter = require('./time_cartola');
const dadoMestreCartolaRouter = require('./dadoMestreCartola');
const atualizarParciaisRouter = require('./atualizarParciais')



const endpoints = {
  message: 'API point do jogador!',
  endpoints: {
    usuarios: {
      caminho: '/usuarios'
    },
    autenticacao: {
      caminho: '/auth'
    },


    liga: {
      caminho: '/liga'
    },

    competicao: {
      caminho: '/competicao'
    },

    bilhete: {
      caminho: '/bilhete'
    },

    time_competicao: {
      caminho: '/time_competicao'
    },

    time_cartola: {
      caminho: '/time_cartola'
    },

    dadoMestreCartola: {
      caminho: '/dadoMestreCartola'
    },

    atualizarParciais: {
      caminho: '/atualizarParciais'
    },
   
  }
};

Router.get('/', (req, res, next) => res.json(endpoints));
Router.use('/auth', authRouter);

Router.use('/liga', ligaRouter);
Router.use('/competicao', competicaoRouter);
Router.use('/bilhete', bilheteRouter);
Router.use('/time_competicao', timeCompeticaoRouter);
Router.use('/time_cartola', timeCartolaRouter);
Router.use('/dadoMestreCartola', dadoMestreCartolaRouter);
Router.use('/atualizarParciais', atualizarParciaisRouter);

module.exports = Router;
