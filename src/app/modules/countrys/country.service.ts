import wiki from "wikipedia";
import { countriesHelper } from "../../../helpers/countrysHelper";
import config from "../../../config";
import axios from "axios";
import path from "path";
import catchAsync from "../../../shared/catchAsync";
import { Move } from "../move/move.model";

const topCountersOfWorld = async (amount: number = 10) => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries: any[] = await response.json();

    // Fetch all existing destination countries in one query & convert to Set
    const existingDestinations = new Set(
        (await Move.find({}, { destinationCountry: 1, _id: 0 })).map(doc => doc.destinationCountry)
    );

    // Function to fetch country details
    const fetchCountryDetails = async (item: any) => {
        const { population, flags, name } = item;
        const flag = flags.png;
        const countryName = name.common;

        const image = (await wiki.images(countryName)).find(img => !img.url.endsWith(".svg"))?.url || "";

        const movingPeople = await Move.countDocuments({ destinationCountry: countryName });

        return { population, flag, image, name: countryName, movingPeople };
    };

    // Get countries that exist in the `Move` model
    const existingCountries = await Promise.all(
        countries.filter(item => existingDestinations.has(item.name.common)).map(fetchCountryDetails)
    );

    // Sort existing countries by people moving
    existingCountries.sort((a, b) => b.movingPeople - a.movingPeople);

    // Fill missing spots with top populated countries
    const missingCount = amount - existingCountries.length;
    const missingCountries = missingCount > 0
        ? await Promise.all(
            countries
                .sort((a, b) => b.population - a.population)
                .slice(0, missingCount)
                .map(fetchCountryDetails)
        )
        : [];

    // Return combined list
    return [...existingCountries, ...missingCountries];
};


const topCountersOfRegions = async (region:string,amount:number=10) => {
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    const countries = await response.json();

    const sortedCountries =Promise.all(
     countries
      .map( async (c: any) => ({
        name: c.name.common,
        population: c.population,
        image: (await wiki.images(c.name.common)).filter(item=>{
            if(!item.url.endsWith(".svg")){
                return item.url
            }
        })[0].url,
        flag: c.flags.png, // Flag image
      }))
    
      .sort((a:any, b:any) => b.population - a.population) // Sort by highest population
      .slice(0, amount)
     ) // Get top 10
      return sortedCountries;
    
}

const singleCountriesDetails = async (query:any)=>{
    const lat = query?.latitude
    const long = query?.longitude
    const response = await wiki.page(query.country)
    const images = (await response.images()).map(item=>{
        const extname = path.extname(item.url)
        if(extname!=='.svg'){
            return item.url
        }
    })
    const details = await response.summary()
    const country = await countriesHelper.countryDetailsFromApi(query.country)
    const latlang:[number,number] = country.latlng || [0,0]
    const distance = countriesHelper.calculateFlightDetails(latlang[0], latlang[1],lat,long)
    return {
        name: query.country,
        population: country.population,
        flag: country.flags.png,
        image: images.filter(item=>item!=null),
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