<template>
  <div class="container">
    <h1>COVID-19 Tracker</h1>
    <div class="card-container">
      <div class="card">
        <div class="title">
          <h6>Cases:</h6>
          <span>{{ addCommasToNumber(totalcases)}}</span>
        </div>
        <hr />
        <div class="top3">
          <h6>Top 3</h6>
          <ul>
            <li
              v-for="country in top3CountryCases"
              v-bind:key="country.country"
            >{{country.country}} - {{ addCommasToNumber(country.cases.total) }}</li>
          </ul>
        </div>
      </div>
      <div class="card">
        <div class="title">
          <h6>Recovered:</h6>
          <span>{{ addCommasToNumber(totalrecovery)}}</span>
        </div>
        <hr />
        <div class="top3">
          <h6>Top 3</h6>
          <ul>
            <li
              v-for="country in top3CountryRecovered"
              v-bind:key="country.country"
            >{{country.country}} - {{ addCommasToNumber(country.cases.recovered) }}</li>
          </ul>
        </div>
      </div>
      <div class="card">
        <div class="title">
          <h6>Deaths:</h6>
          <span>{{ addCommasToNumber(totaldeaths)}}</span>
        </div>
        <hr />
        <div class="top3">
          <h6>Top 3</h6>
          <ul>
            <li
              v-for="country in top3CountryDeaths"
              v-bind:key="country.country"
            >{{country.country}} - {{ addCommasToNumber(country.deaths.total) }}</li>
          </ul>
        </div>
      </div>
    </div>
    <CountryData :data="stats" />
  </div>
</template>

<script>
import CovidDataService from "../data/CovidDataService";
import CountryData from "../components/CountryData";

export default {
  name: "WorldData",
  components: {
    CountryData
  },
  data() {
    return {
      stats: [],
      totalcases: 0,
      totalrecovery: 0,
      totaldeaths: 0,
      top3CountryCases: [],
      top3CountryRecovered: [],
      top3CountryDeaths: []
    };
  },
  async created() {
    let data = await CovidDataService.GetStats();
    this.loadOverAllTotals(data);
    this.getTop3Cases(data);
    this.getTop3Recovered(data);
    this.getTop3Deaths(data);
    data.sort((a, b) => {
      if (a.country > b.country) {
        return 1;
      } else {
        return -1;
      }
    });
    this.stats = data;
  },
  methods: {
    loadOverAllTotals(data) {
      let all = {};
      data.forEach(country => {
        if (country.country === "All") {
          all = country;
        }
      });
      this.totalcases = all.cases.total;
      this.totalrecovery = all.cases.recovered;
      this.totaldeaths = all.deaths.total;
    },
    getTop3Cases(cases) {
      cases = cases.sort((a, b) => {
        if (a.cases.total > b.cases.total) {
          return -1;
        } else {
          return 1;
        }
      });
      let top3 = [];
      let i = 0;
      cases.forEach(country => {
        if (this.isValidCountry(country)) {
          i++;
          if (i <= 3) {
            top3.push(country);
          }
        }
      });
      this.top3CountryCases = top3;
    },
    getTop3Recovered(recovered) {
      recovered.sort((a, b) => {
        if (a.cases.recovered > b.cases.recovered) {
          return -1;
        } else {
          return 1;
        }
      });
      let top3 = [];
      let i = 0;
      recovered.forEach(country => {
        if (this.isValidCountry(country)) {
          i++;
          if (i <= 3) {
            top3.push(country);
          }
        }
      });
      this.top3CountryRecovered = top3;
    },
    getTop3Deaths(deaths) {
      deaths.sort((a, b) => {
        if (a.deaths.total > b.deaths.total) {
          return -1;
        } else {
          return 1;
        }
      });
      let top3 = [];
      let i = 0;
      deaths.forEach(country => {
        if (this.isValidCountry(country)) {
          i++;
          if (i <= 3) {
            top3.push(country);
          }
        }
      });
      this.top3CountryDeaths = top3;
    },
    isValidCountry(country) {
      return (
        (country.country !== "All") &
        (country.country !== "Europe") &
        (country.country !== "North-America") &
        (country.country !== "South-America") &
        (country.country !== "Diamond-Princess") &
        (country.country !== "Africa") &
        (country.country !== "Oceania") &
        (country.country !== "Asia")
      );
    },
    addCommasToNumber(number) {
      number += "";
      let x = number.split(".");
      let x1 = x[0];
      let x2 = x.length > 1 ? "." + x[1] : "";
      let rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
      }
      return x1 + x2;
    }
  }
};
</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
}
.card {
  border: 1px solid #b86805;
  border-radius: 5px;
  margin: 5px;
}
.card .title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
}
.card .title h6,
.card .title span {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 0px;
  margin-top: 3px;
  margin-right: 3px;
}
.card .top3 h6 {
  font-size: 15px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.card .top3 ul {
  list-style: none;
  text-align: left;
  padding: 10px 10px;
  margin: 0;
}

@media screen and (max-width: 500px) {
  .card-container {
    display: block;
  }
}
</style>