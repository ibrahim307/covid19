import React, { Component } from "react";
import Loading from "./Loading";
import CountryTable from "./CountryTable";
import Chart from "./Chart"
import axios from "axios";

class Covid extends Component {
  state = {
    countries: [],
    allCountryTotal: 0,
    selectedCountries:[]
  };

  url =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_country.csv";
 
 
    async componentDidMount() {
    const response = await axios.get(this.url);
    const rows = response.data.split("\n");
    const countries = [];
    let allCountryTotal = 0;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // spliting on a comma , exemple: corea,south
      const countryName = row[0].replace(/"/g, "");     //51
      const total = Number(row[4]);
      if (countryName !== "") {
        countries.push({
          name: countryName,
          total: total,
        });
        allCountryTotal += total;
      }
    }
    await new Promise((x) => setTimeout(x, 500));
    this.setState({
      countries,
      allCountryTotal,
    });
  }

  handleOnRowSelected= (countryToUpdate) => {
      const countries=[...this.state.countries]
      const countryIndex=countries.findIndex((c)=> c.name ===countryToUpdate.name)
      const country = {
        name:countryToUpdate.name,
        total:countryToUpdate.total,
        selected: !countryToUpdate.selected
      }
      countries[countryIndex]=country
      this.setState({
        countries,
        selectedCountries: countries.filter(c=> c.selected)
      })

  }

  sortByTotal = (countryA, countryB) => {
    // 0 equal
    // 1 greater
    // -1 less
    if (countryB.total > countryA.total) return 1;
    else if (countryB.total < countryA.total) return -1;
    else return 0;
  };

  handleOnSortByTotal = (e) => {
   this.handleOnSortBy(e,this.sortByTotal)
  };

  sortByCountryName = (countryA, countryB) => {
    // 0 equal
    // 1 greater
    // -1 less
    if (countryA.name > countryB.name) return 1;
    else if (countryA.name < countryB.name) return -1;
    else return 0;
  };

  onHandleSortByCountryName = (e) =>{
   this.handleOnSortBy(e,this.sortByCountryName)
  }

  handleOnSortBy = (e, sortOperation) => {
    e.preventDefault();
    const countries = [...this.state.countries];
    countries.sort(sortOperation);
    this.setState({ countries });
  }


  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  render() {
    const { countries, allCountryTotal, selectedCountries } = this.state;
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>
          All Country Total {this.numberWithCommas(allCountryTotal)}
        </h1>
        {allCountryTotal === 0 ? (
          <Loading />
        ) : (
          <div>
          <Chart countries={selectedCountries}/>
          <CountryTable
            countries={countries}
            onSortByTotal={this.handleOnSortByTotal}
            onSortByCountryName={this.onHandleSortByCountryName}
            onRowSelected={this.handleOnRowSelected}
          />
          </div>
        )}
      </div>
    );
  }
}
export default Covid;
