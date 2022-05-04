const {
  cadastrarCompeticao,
  delCompeticaoPorId,
  putCompeticao, 
  getTodasCompeticoes
} = require('../repository/competicao');

const cadastro = (req, res, next) => {
  const dadosCompeticao = req.body;
  return cadastrarCompeticao(dadosCompeticao)
    .then(competicao => {
      if (!competicao) {
        return res.status(409).end();
      }
      return res.status(200).end();
    })
    .catch(error => next(error));
};

const excluirCompeticaoPorId = (req, res, next) => {
  const id_competicao = req.params.id_competicao;
  return delCompeticaoPorId(id_competicao)
      .then(competicao => {
          if (!competicao) {
              return res.status(404).end();
          }
          return res.status(200).end();
      })
      .catch(function (error) {
          res.status(500).json(error);
      });
  };
  
  const alterarCompeticao = (req, res, next) => {
  const dadoscompeticao = req.body;
  return putCompeticao(dadoscompeticao)
      .then(competicao => {
          if (!competicao) {
              return res.status(404).end();
          }
          return res.status(200).end();
      })
      .catch(function (error) {
          res.status(500).json(error);
      });
  };


  const listarTodasCompeticoes = (req, res, next) => {
    return getTodasCompeticoes()
      .then(compe => res.json(compe))
      .catch(err => next(err));
  };


module.exports = {
  cadastro,
  excluirCompeticaoPorId,
  alterarCompeticao,
  listarTodasCompeticoes
};

