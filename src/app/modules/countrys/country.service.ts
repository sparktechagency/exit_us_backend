import wiki from "wikipedia";
import { countriesHelper } from "../../../helpers/countrysHelper";
import config from "../../../config";
import axios from "axios";
import path from "path";
import catchAsync from "../../../shared/catchAsync";
import { Move } from "../move/move.model";
import { ethenityData } from "../../../demo-data/ethenity.data";
import { CountryDetailsService } from "./country-details-service/country.details.service";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { COUNTRY_DETAILS_TOPIC } from "../../../enums/countryDetailsTopic";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { imageHelper } from "../../../helpers/imageHelper";
import { demoImage } from "./country.contstrant";
import { searchHelper } from "../../../helpers/wikiSearchHelper";
const userAgent= "ytyyt";
const topCountersOfWorld = async (query:Record<string, any>) => {

  
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

    try {
      const getImage = async (name: string): Promise<string> => {
        const imgs = await wiki.images(name);
        
        return imgs.find((img) => ['.jpg','.png','.gif','.webp'].includes(path.extname(img.url)))?.url || "";
      };
    
    
      const buildCountryInfo = async (name: string) => {
        const data = countryMap.get(name);
        const movingPeople = await Move.countDocuments({ destinationCountry: name });
        return {
          name,
          flag: data.flag,
          population: data.population,
          image:"",
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
      const amount = query.limit || 10;
  
      if (result.length < amount) {
  
    
        const alreadyIncluded = new Set(result.map(c => c.name));
    
        const topPopulated = countries
          .filter(c => !alreadyIncluded.has(c.name.common))
          .sort((a, b) => b.population - a.population)
    
        const populatedData = await Promise.all(
          topPopulated.map(async c => {
            const name = c.name.common;
            const image = await getImage(name)||demoImage;
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
    
      const paginateArray = paginationHelper.paginateArray(result, query);
      return {
        data:await Promise.all(paginateArray.data.map(async (c: any) => {
          const image = await getImage(c.name)||demoImage;
          return {
            ...c,
            image: image
          };
        })),
        pagination: paginateArray.pagination,
      }
    } catch (error) {
      console.log(error);
      
      const customaizeCituys = countries.map((c)=>{
          return {
            name: c.name.common,
            population: c.population,
            flag: c.flags.png, // Flag image
          };
        });

        const paginateArray = paginationHelper.paginateArray(customaizeCituys, query);
        return {
          data:paginateArray.data,
          pagination: paginateArray.pagination,
        }
      }
    
  };
  


const topCountersOfRegions = async (region:string,query:Record<string, any>) => {
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    const countries = await response.json();

    const sortedCountries =await Promise.all(
     countries
      .map( async (c: any) => ({
        name: c.name.common,
        population: c.population,
        flag: c.flags.png, // Flag image
      }))
    
      .sort((a:any, b:any) => b.population - a.population) // Sort by highest population
      
     )

     const paginateArray = paginationHelper.paginateArray(sortedCountries, query);
     return {
        data:paginateArray.data,
        pagination: paginateArray.pagination,
      }
      
    
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
        distanceInKm: (distance.distance.toFixed(2)!="NaN")?distance.distance.toFixed(2)+'kms':"...",
        flightTime: !distance.flightTime.includes("NaN")?distance.flightTime:"...",
        capital: country.capital,
        region: country.region,
        latitude: latlang[0],
        longitude: latlang[1],
        short_name:country.flag
    }

    
}
const getCitysByCountry = async (countryName: string, query: any) => {

    
    const url = `https://countriesnow.space/api/v0.1/countries/cities`

    const response = await fetch(url, {
      method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            country: countryName.toLowerCase(),
            limit:10
        }),
    });
    

    const res: any = await response.json()
    


    const cities: any[] = res.data?.slice(0, 20);
    console.log(cities);
    

try {
  const data = await Promise.all(
    cities.map(async (c) => {
     
        return {
            name: c,
            images:(await imageHelper.getImage(c))[0]||demoImage,
        };
      
    })
);
const paginateArray = paginationHelper.paginateArray(data.filter(item=>Boolean(item)), query);
return {
    data: paginateArray.data,
    pagination: paginateArray.pagination,
};
} catch (error) {
  

  
  const customaizeCituys =await Promise.all(cities.map(async (c)=>{

    const getImage = async (name: string): Promise<string> => {
      const search = await wiki.search(name);
      const page = await wiki.page(search.results[0].title);
      const imgs = await page.images();
      
      return imgs.find((img) => ['.jpg','.png','.gif','.webp'].includes(path.extname(img.url)))?.url || "";
    };
    
    return {
      name: c,
      images: await getImage(c) || demoImage,
      details: null,
    };
  }))
  
  const paginateArray = paginationHelper.paginateArray(customaizeCituys, query);
  return {
      data: paginateArray.data,
      pagination: paginateArray.pagination,
  };
}
    // Wait for all city details


};

const getCountrysFromApi =async ()=>{
  const response =await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
  const data = await response.json()
  return data
}

const getEthenity =async ()=>{
  return ethenityData.ethnicities
}


const getRegions =async (query:Record<string,any>)=>{
  const res = await fetch('https://restcountries.com/v3.1/all?fields=region')
  const data = await res.json()
  
  const regions = new Set([...data.map((d:any)=>d.region)])
  return [...regions]
}

const countryDetailsFromApi =async (topic:COUNTRY_DETAILS_TOPIC,country:string)=>{

  switch(topic?.toLowerCase()){
    case 'church':
      return await CountryDetailsService.getChurchesFromApi(country)
    
    case 'music':
      return await CountryDetailsService.MusicFromApi(country)
    case 'culture':
      return await CountryDetailsService.cultureFromApi(country)
    case 'jobs':
      return await CountryDetailsService.jobsFromApi(country)
    case 'safety':
      return await CountryDetailsService.adviseFromApi(country)
    case 'visa':
      return await CountryDetailsService.visaInfoFromApi(country)
    case 'dual':
      return await CountryDetailsService.dualChitezenShipInfoFromApi(country)
    case 'moving':
      return await CountryDetailsService.movingTipsFromApi(country)
    case 'cost':
      return await CountryDetailsService.livingCostFromApi(country)
    case 'resources':
      return await CountryDetailsService.resourceListFromAPi(country)
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST,'Invalid topic')
  }
  
}

const getSingleCiyDetails =async (city:string)=>{
  const response = await searchHelper.wikiSearchService(city)
  
  return response
}
export const CountryService={
    topCountersOfWorld,
    topCountersOfRegions,
    singleCountriesDetails,
    getCitysByCountry,
    getCountrysFromApi,
    getEthenity,
    getRegions,
    countryDetailsFromApi,
    getSingleCiyDetails
 
}