<template>
  <div class="container">
    <label>Select Country:</label>
    <select id="countryList" v-model="selectedCountry" v-on:change="onCountrySelect">
      <option
        v-for="country in data"
        v-bind:value="country.country"
        v-bind:key="country.country"
      >{{country.country}}</option>
    </select> &nbsp;
    <button v-on:click="loadCountryData">Refresh</button>
    <br />
    <br />
    <div class="todays-data">
      <h6>Latest</h6>
      <ul>
        <li>
          <b>Cases:</b>
          <br />
          {{todaysData.cases}}
        </li>
        <li>
          <b>Recoveries:</b>
          <br />
          {{todaysData.recoveries}}
        </li>
        <li>
          <b>Deaths:</b>
          <br />
          {{todaysData.deaths}}
        </li>
        <li>
          <b>Total Tests:</b>
          <br />
          {{ todaysData.totaltests}}
        </li>
      </ul>
      <ul>
        <li>
          <b>Total:</b>
          <br />
          {{todaysData.totalCases}}
          <br />
          <small>({{ ((todaysData.totalCases/todaysData.totaltests) * 100).toFixed(2) }}%)</small>
        </li>
        <li>
          <b>Recoveries:</b>
          <br />
          {{todaysData.totalRecoveries}}
        </li>
        <li>
          <b>Deaths:</b>
          <br />
          {{todaysData.totalDeaths}}
        </li>
        <li>
          <b style="color:red;">
            Recovery %:
            <br />
            {{ ((todaysData.totalRecoveries /todaysData.totalCases ) * 100).toFixed(2)}}
          </b>
        </li>
      </ul>
    </div>
    <br />
    <div class="chart-container">
      <canvas id="covid-chart"></canvas>
    </div>
    <br />
  </div>
</template>
<script>
import CovidDataService from "../data/CovidDataService";
import Chart from "chart.js";
import CountryGraphData from "../data/CountryGraphData";

export default {
  name: "CountryData",
  props: {
    data: Array
  },
  data() {
    return {
      selectedCountry: "Philippines",
      cases: { day: [], bgcolor: [], count: [] },
      recoveries: { bgcolor: [], count: [] },
      deaths: { bgcolor: [], count: [] },
      recoverpct: { bgcolor: [], pct: [] },
      todaysData: {}
    };
  },
  async created() {
    this.loadCountryData();
  },
  methods: {
    onCountrySelect: async function() {
      this.loadCountryData();
    },
    async loadCountryData() {
      let history = await CovidDataService.GetCountryHistoricalStats(
        this.selectedCountry
      );
      this.cases.day = [];
      this.cases.count = [];
      this.deaths.count = [];
      this.deaths.bgcolor = [];
      this.recoveries.count = [];
      this.recoveries.bgcolor = [];

      let lastCasesTotal = 0;
      let lastRecovery = 0;
      let lastTestCount = 0;
      let recoveriesToday = 0;
      for (let i = history.length - 1; i >= 0; i--) {
        const record = history[i];
        if (
          (this.cases.day.indexOf(record.day) < 0) &
          (record.cases.new != null)
        ) {
          //let today = new Date();
          if (lastCasesTotal !== record.cases.total) {
            this.cases.day.push(record.day);
            this.cases.count.push(record.cases.new.substr(1));
            this.cases.bgcolor.push("rgba(255, 0, 0,.8)");
            let deaths = 0;
            if (record.deaths.new != null) {
              deaths = record.deaths.new.substr(1);
            }
            recoveriesToday = record.cases.recovered - lastRecovery;
            this.deaths.count.push(deaths);
            this.deaths.bgcolor.push("rgba(0,0,0,0.8)");
            this.recoveries.count.push(recoveriesToday);
            this.recoveries.bgcolor.push("rgba(0,255,0, 0.9)");

            lastCasesTotal = record.cases.total;
            lastRecovery = record.cases.recovered;
          }
        }
      }
      let record = history[0];
      this.todaysData = {
        cases: record.cases.new,
        deaths: record.deaths.new,
        recoveries: "+" + recoveriesToday,
        totaltests: record.tests.total,
        totalCases: record.cases.total,
        totalRecoveries: record.cases.recovered,
        totalDeaths: record.deaths.total
      };
      CountryGraphData.data.labels = this.cases.day;
      CountryGraphData.data.datasets = [];
      CountryGraphData.data.datasets.push({
        label: "Cases",
        data: this.cases.count,
        backgroundColor: this.cases.bgcolor,
        borderColor: ["#CC1916"],
        borderWidth: 3
      });
      CountryGraphData.data.datasets.push({
        label: "Recovery",
        data: this.recoveries.count,
        backgroundColor: this.recoveries.bgcolor,
        borderColor: ["#23CC1F"],
        borderWidth: 3
      });
      CountryGraphData.data.datasets.push({
        label: "Deaths",
        data: this.deaths.count,
        backgroundColor: this.deaths.bgcolor,
        borderColor: ["#000000"],
        borderWidth: 3
      });

      this.createChart();
    },
    createChart() {
      const ctx = document.getElementById("covid-chart");
      const chart = new Chart(ctx, {
        type: CountryGraphData.type,
        data: CountryGraphData.data,
        options: CountryGraphData.options
      });
    }
  }
};
</script>
<style scoped>
.chart-container {
  position: relative;
  height: 20vh;
  width: 60vw;
  margin: 0 auto;
}
.todays-data {
  margin: 0 auto;
  border: 1px solid #b86805;
  border-radius: 5px;
  width: 55%;
  padding-top: 5px;
}
.todays-data h6 {
  font-size: 15px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.container label {
  font-weight: bold;
  margin-right: 10px;
}
.todays-data ul {
  list-style: none;
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.todays-data li {
  margin-right: 10px;
}
@media screen and (max-width: 600px) {
  .chart-container {
    width: 95vw;
    height: 40vh;
  }
  .todays-data {
    width: 100%;
  }
}
@media screen and (min-width: 1000px) {
  .chart-container {
    width: 70vw;
    height: 40vh;
  }
}
</style>