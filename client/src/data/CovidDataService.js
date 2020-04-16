import axios from 'axios';
const url = 'https://covid-193.p.rapidapi.com/statistics';
class CovidDataService {
  static GetStats() {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/statistics',
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': 'covid-193.p.rapidapi.com',
          'x-rapidapi-key': '[GET-YOUR-API-KEY]',
        },
      })
        .then((response) => {
          resolve(response.data.response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static GetCountryHistoricalStats(country) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `https://covid-193.p.rapidapi.com/history?country=${country}`,
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host': 'covid-193.p.rapidapi.com',
          'x-rapidapi-key': '[GET-YOUR-API-KEY]',
        },
      })
        .then((response) => {
          resolve(response.data.response);
        })
        .catch((error) => {
          reject(err);
        });
    });
  }
}

export default CovidDataService;
