import wiki from "wikipedia";
import { countriesHelper } from "../../../helpers/countrysHelper";
import config from "../../../config";
import axios from "axios";
import path from "path";
import catchAsync from "../../../shared/catchAsync";
import { Move } from "../move/move.model";
import { ethenityData } from "../../../demo-data/ethenity.data";

const topCountersOfWorld = async (amount: number = 10) => {
    const [countriesResponse, existingMoves] = await Promise.all([
      fetch("https://restcountries.com/v3.1/all?fields=name,population,flags"),
      Move.find({}, { destinationCountry: 1, _id: 0 })
    ]);
  
    const countries: any[] = await countriesResponse.json();
  
    const existingDestinations = new Set(existingMoves.map(doc => doc.destinationCountry));
  
    const countryMap = new Map<string, any>();
  
    // Build quick lookup map to avoid searching every time
    for (const country of countries) {
      const name = country.name.common;
      countryMap.set(name, {
        name,
        population: country.population,
        flag: country.flags?.png || "",
      });
    }
  
    const getImage = async (name: string): Promise<string> => {
      const imgs = await wiki.images(name);
      
      return imgs.find((img) => ['.jpg','.png','.gif','.webp'].includes(path.extname(img.url)))?.url || "";
    };
  
    const buildCountryInfo = async (name: string) => {
      const data = countryMap.get(name);
      const movingPeople = await Move.countDocuments({ destinationCountry: name });
      const image = await getImage(name);
      return {
        name,
        flag: data.flag,
        population: data.population,
        image,
        movingPeople,
      };
    };
  
    // Prioritize existing countries with Move data
    const existingCountriesList = await Promise.all(
      [...existingDestinations]
        .filter(name => countryMap.has(name))
        .map(buildCountryInfo)
    );
  
    // Sort by most people moving
    const sortedExisting = existingCountriesList.sort((a, b) => b.movingPeople - a.movingPeople);
  
    const result: any[] = [...sortedExisting];
  
    // Fill remaining slots with top populated countries (not already included)
    if (result.length < amount) {
      const missingCount = amount - result.length;
  
      const alreadyIncluded = new Set(result.map(c => c.name));
  
      const topPopulated = countries
        .filter(c => !alreadyIncluded.has(c.name.common))
        .sort((a, b) => b.population - a.population)
        .slice(0, missingCount);
  
      const populatedData = await Promise.all(
        topPopulated.map(async c => {
          const name = c.name.common;
          const image = await getImage(name);
          return {
            name,
            flag: c.flags?.png || "",
            population: c.population,
            image,
            movingPeople: 0,
          };
        })
      );
  
      result.push(...populatedData);
    }
  
    return result.slice(0, amount);
  };
  


const topCountersOfRegions = async (region:string,amount:number=10) => {
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    const countries = await response.json();

    const sortedCountries =Promise.all(
     countries
      .map( async (c: any) => ({
        name: c.name.common,
        population: c.population,
        image: (await wiki.images(c.name.common)).filter((item:any)=>{
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
    const images = (await response.images()).map((item:any)=>{
        const extname = path.extname(item.url)
        if(['.jpg','.png','.gif','.webp'].includes(extname)){
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
        image: images.filter((item:any)=>item!=null),
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
            const images = (await details.images()).filter((item: any) => ['.jpg', '.png', '.gif', '.webp'].includes(path.extname(item.url)))[1];
            return {
                name: c.name,
                images: images.url,
                details: (await details.summary()).extract,
            };
        })
    );

    return data;
};

const getCountrysFromApi =async ()=>{
  const response =await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
  const data = await response.json()
  return data
}

const getEthenity =async ()=>{
  return ethenityData.ethnicities
}
export const CountryService={
    topCountersOfWorld,
    topCountersOfRegions,
    singleCountriesDetails,
    getCitysByCountry,
    getCountrysFromApi,
    getEthenity
 
}