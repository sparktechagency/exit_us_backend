import wiki from "wikipedia";
import { countriesHelper } from "../../../helpers/countrysHelper";
import config from "../../../config";
import axios from "axios";

const topCountersOfWorld = async (amount:number=10)=>{
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    const sortedCountries = countries
      .map((c: any) => ({
        name: c.name.common,
        population: c.population,
        flag: c.flags.png, // Image of the flag
      }))
      .sort((a:any, b:any) => b.population - a.population) // Sort by population (descending)
      .slice(0, amount);// Get top 10
      return sortedCountries;

}

const topCountersOfRegions = async (region:string,amount:number=10) => {
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    const countries = await response.json();

    const sortedCountries = countries
      .map((c: any) => ({
        name: c.name.common,
        population: c.population,
        flag: c.flags.png, // Flag image
      }))
      .sort((a:any, b:any) => b.population - a.population) // Sort by highest population
      .slice(0, amount); // Get top 10
      return sortedCountries;
}

const singleCountriesDetails = async (query:any)=>{
    const lat = query?.latitude
    const long = query?.longitude
    const response = await wiki.page(query.country)
    const images = (await response.images()).map(item=>item.url)
    const details = await response.summary()
    const country = await countriesHelper.countryDetailsFromApi(query.country)
    const latlang:[number,number] = country.latlng || [0,0]
    const distance = countriesHelper.calculateFlightDetails(latlang[0], latlang[1],lat,long)
    return {
        name: query.country,
        population: country.population,
        flag: country.flags.png,
        image: images,
        details: details.extract,
        distanceInKm: distance.distance.toFixed(2),
        flightTime: distance.flightTime,
        capital: country.capital,
        region: country.region,
        latitude: latlang[0],
        longitude: latlang[1],
        short_name:country.flag
    }

    
}
const getCitysByCountry = async (countryName: string, query: any) => {

    
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryName.toUpperCase()}/regions`

    const response = await fetch(url, {
        headers: {
            'x-rapidapi-host': config.geo.host!,
            'X-RapidAPI-Key': config.geo.apiKey!,
        },
    });

    const res: any = await response.json();
    

    const cities: any[] = res.data;

    // Slice the cities array before starting the async operation
    const limitedCities = cities.slice(0, query.amount || 10);

    // Wait for all city details
    const data = await Promise.all(
        limitedCities.map(async (c) => {
            const details = await wiki.page(c.name);
            const images = (await details.images())[0];
            return {
                name: c.name,
                images: images.url,
                details: (await details.summary()).extract,
            };
        })
    );

    return data;
};
export const CountryService={
    topCountersOfWorld,
    topCountersOfRegions,
    singleCountriesDetails,
    getCitysByCountry
 
}