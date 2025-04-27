import axios from "axios";
import { searchHelper } from "../../../../helpers/wikiSearchHelper";
import { countriesHelper } from "../../../../helpers/countrysHelper";
import config from "../../../../config";
import wiki from "wikipedia";
import path from "path";
import { ad, bi } from "@upstash/redis/zmscore-BdNsMd17";
import { listeners } from "process";
import { add } from "winston";
import { awaitMediaLoaded } from "face-api.js";

const getChurchesFromApi = async (country:string) => {
    console.log(country);
    
    const data = await resourceListFromAPi(country,'religion.place_of_worship')
    return data
};

const MusicFromApi = async (country:string) => {
   const response = await axios.get(`https://spotify-scraper3.p.rapidapi.com/api/artists/search?query=${country}&offset=0&limit=5`,{
    headers:{
        "x-rapidapi-host":"spotify-scraper3.p.rapidapi.com",
        "x-rapidapi-key":config.musicApi.apiKey
    }
   })
   const artist = await response?.data?.data?.artists
   console.log(artist);
   
   const filterArtist = await Promise.all( artist?.map(async (item:any)=>{
    const search = await wiki.search(item.name);
    const data = await wiki.page(search?.results[0]?.pageid);
    const images = item.avatar_images[0]
    return {
        name:item.name,
        image:images,
        bio:(await data.summary()).extract,
        url:item.uri
    }

   }))
   const songsResponse = await axios.get(`https://spotify-scraper3.p.rapidapi.com/api/tracks/search?query=${country}%20songs&offset=0&limit=5`,{
    headers:{
        "x-rapidapi-host":"spotify-scraper3.p.rapidapi.com",
        "x-rapidapi-key":config.musicApi.apiKey
    }
   })


   const songs = await songsResponse?.data?.data?.tracks
   
   return {
    top_artist:filterArtist,
    top_songs:songs?.map((item:any)=>({
        name:item.name,
        image:item?.album?.cover_images[2]?.url,
        url:item?.uri
    }))
   }
   
};

const cultureFromApi = async (country:string) => {
    const culture =await searchHelper.wikiSearchService(`culture of ${country}`,['culture']);
    return culture;
    
};

const jobsFromApi = async (country:string) => {
    const response = await axios.get(`https://remotive.com/api/remote-jobs?search=${country}&limit=10`)
    return response.data.jobs
};

const adviseFromApi = async (country:string) => {
    const response = await axios.get(`https://api.tugo.com/v1/travelsafe/countries/${country}`,{
        headers: {
            "X-Auth-API-Key":config.togoAdvisory.apiKey
        }
    })
    return response.data
};

const movingTipsFromApi = async (country:string) => {
    const data = await adviseFromApi(country)
    const climate = data?.climate?.climateInfo
    const entryAndExit = data?.entryExitRequirement

    return {climate,entryAndExit}
}
const visaInfoFromApi = async (country:string) => {
    const data = await searchHelper.wikiSearchService(`Visa requirements for ${country}`,['visa']);
    return data
};

const dualChitezenShipInfoFromApi = async (country:string) => {
    const data = await searchHelper.wikiSearchService(`${country} nationality law`,[])
    return data[0]
}

const livingCostFromApi = async (country:string) => {
    const countryData = await countriesHelper.countryDetailsFromApi(country)
    const capital = countryData?.capital[0]
    const costs = await axios.get(`https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${capital}&country_name=${country}`,{
        headers:{
            "x-rapidapi-host":"cost-of-living-and-prices.p.rapidapi.com",
            "x-rapidapi-key":config.livingCostApi.apiKey
        }
    })

    return costs.data
}

const resourceListFromAPi = async (country:string,catagories:string='commercial.supermarket,education.library,education.school,education.university') => {
    const county = await countriesHelper.countryDetailsFromApi(country)

    
    const capital = county?.capital[0]
    
    const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${capital}%2C${country}&format=json&apiKey=${config.locationAPi.geoApiKey}`)
    const place_id = response?.data?.results[0]?.place_id


    const resources = await axios.get(`https://api.geoapify.com/v2/places?categories=${catagories}&filter=place:${place_id}&limit=20&apiKey=${config.locationAPi.geoApiKey}`)

    const features = resources.data?.features
    return features.map((item:any)=>{
        const obj = {
            name:item.properties.name,
            address:item.properties.formatted,
            latitude:item.geometry.coordinates[1],
            longitude:item.geometry.coordinates[0],
            catageroy:item.properties.categories
        }
        return obj

    })
}
export const CountryDetailsService = {
    getChurchesFromApi,
    MusicFromApi,
    cultureFromApi,
    jobsFromApi,
    adviseFromApi,
    visaInfoFromApi,
    dualChitezenShipInfoFromApi,
    movingTipsFromApi,
    livingCostFromApi,
    resourceListFromAPi

}