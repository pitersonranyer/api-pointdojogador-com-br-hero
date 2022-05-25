const { getTimesCartola,
  getMercadoStatus,
  getTimeCartola
 } = require('../repository/cartolaAPI');




const listarTimesCartola = (req, res, next) => {
  time = req.params.time;
  return getTimesCartola(time)
    .then(times => res.json(times))
    .catch(err => next(err));
};

const consultarMercadoStatus = async (req, res, next) => {
  return getMercadoStatus()
    .then(status => res.json(status))
    .catch(err => next(err));
};

const consultarTimeCartola = async (req, res, next) => {
  idTime = req.params.idTime;
  return getTimeCartola(idTime)
    .then(time => res.json(time))
    .catch(err => next(err));
};


module.exports = {
  listarTimesCartola,
  consultarMercadoStatus,
  consultarTimeCartola
};