const {
  cadastrarBilhete
} = require('../repository/bilhete');

const cadastro = async (req, res, next) => {
  const dadosBilhete = req.body;
  return cadastrarBilhete(dadosBilhete)
      .then(bilhete => {
          if (!bilhete) {
              return res.status(409).end();
          }

          return res.json(bilhete);
      })
      .catch(error => next(error));
};


module.exports = {
  cadastro
};

