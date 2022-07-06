const Router = require('express').Router();
const authRouter = require('./auth');
const usuariosRouter = require('./usuarios');

const cartolaAPIrouter = require('./cartolaAPI');
const ligaRouter = require('./liga');
const competicaoRouter = require('./competicao');
const bilheteRouter = require('./bilhete');
const timeCompeticaoRouter = require('./time_competicao');
const timeCartolaRouter = require('./time_cartola');
const dadoMestreCartolaRouter = require('./dadoMestreCartola');
const atualizarParciaisRouter = require('./atualizarParciais')
const atletasPontuadosRouter = require('./atleta_pontuado')



const endpoints = {
  message: 'API point do jogador!',
  endpoints: {
    usuarios: {
      caminho: '/usuarios'
    },
    autenticacao: {
      caminho: '/auth'
    },

    cartolaAPI: {
      caminho: '/cartolaAPI'
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

    atletasPontuados: {
      caminho: '/atleta_pontuado'
    },


    
   
  }
};


Router.use('/cartolaAPI', cartolaAPIrouter);
Router.get('/', (req, res, next) => res.json(endpoints));
Router.use('/auth', authRouter);
Router.use('/usuarios', usuariosRouter);
Router.use('/liga', ligaRouter);
Router.use('/competicao', competicaoRouter);
Router.use('/bilhete', bilheteRouter);
Router.use('/time_competicao', timeCompeticaoRouter);
Router.use('/time_cartola', timeCartolaRouter);
Router.use('/dadoMestreCartola', dadoMestreCartolaRouter);
Router.use('/atualizarParciais', atualizarParciaisRouter);
Router.use('/atleta_pontuado', atletasPontuadosRouter);

module.exports = Router;
