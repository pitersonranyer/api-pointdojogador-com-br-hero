var unirest = require("unirest");
const sequelize = require('../database/database');

const BASE_URL = 'https://api.cartolafc.globo.com';

const URL_LOGIN = 'https://login.globo.com/api/authentication'


const getTimesCartola = (time) => {

  path = `/times?q=${time}`;
  var url = `${BASE_URL}${path}`;



  return unirest.get(url)
    .header(
      "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
      "Accept", "application/json, text/plain, */*",
      "Referer", "https://cartolafc.globo.com/",
      "Origin", "https://cartolafc.globo.com/",
      "Accept-Language", "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2"
    )

    .then(data => {
      if (data === null) {
        return false;
      } else {
        return data.body;
      }
    });
}

const getMercadoStatus = async () => {

  path = `/mercado/status`;
  var url = `${BASE_URL}${path}`;

  mercado = await unirest.get(url)
    .header(
      "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
      "Accept", "application/json, text/plain, */*",
      "Referer", "https://cartolafc.globo.com/",
      "Origin", "https://cartolafc.globo.com/",
      "Accept-Language", "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2"
    )

  if (mercado === null) {
    return false;
  } else {
    return mercado.body;
  }
}

const getTimeCartola = async (idTime) => {

 // var nrRodada = 38;

  path = `/time/id/${idTime}`;
  var url = `${BASE_URL}${path}`;

  dadosTime = await unirest.get(url)
    .header(
      "User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
      "Accept", "application/json, text/plain, */*",
      "Referer", "https://cartolafc.globo.com/",
      "Origin", "https://cartolafc.globo.com/",
      "Accept-Language", "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4,es;q=0.2"
    )

  if (dadosTime === null) {
    return false;
  } else {
    return dadosTime.body;
  }
}



module.exports = {
  getTimesCartola,
  getMercadoStatus,
  getTimeCartola
  
};