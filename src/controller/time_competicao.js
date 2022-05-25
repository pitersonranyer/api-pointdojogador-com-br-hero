const {
  cadastrarTimeCompeticao,
  getTimesDaCompeticao
} = require('../repository/time_competicao');

const cadastro = async  (req, res, next) => {
  const dadosTimeCompeticao = req.body;
  return cadastrarTimeCompeticao(dadosTimeCompeticao)
    .then(timeCompeticao => {
      if (!timeCompeticao) {
        return res.status(409).end();
      }
     // return res.status(200).end(timeCompeticao);
      return res.json(timeCompeticao);
    })
    .catch(error => next(error));
};

const listarTimesDaCompeticao = async  (req, res, next) => {
  const id_competicao = req.params.id_competicao;
  const numero_rodada_atual = req.params.numero_rodada_atual;
  return getTimesDaCompeticao(id_competicao, numero_rodada_atual)
    .then(timeCompeticao => res.json(timeCompeticao))
    .catch(err => next(err));
};

module.exports = {
  cadastro,
  listarTimesDaCompeticao
};

