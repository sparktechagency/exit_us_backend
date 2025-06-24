import axios from "axios";
import { searchHelper } from "../../../../helpers/wikiSearchHelper";
import { countriesHelper } from "../../../../helpers/countrysHelper";
import config from "../../../../config";
import wiki from "wikipedia";


const getChurchesFromApi = async (country:string) => {
   
    
    
    return `https://weekdaymasses.org.uk/en/area/${country.toLowerCase().split(" ").join("-")}/churches`
};

const MusicFromApi = async (country:string) => {
//    const response = await axios.get(`https://spotify-scraper3.p.rapidapi.com/api/artists/search?query=${country}&offset=0&limit=5`,{
//     headers:{
//         "x-rapidapi-host":"spotify-scraper3.p.rapidapi.com",
//         "x-rapidapi-key":config.musicApi.apiKey
//     }
//    })
//    const artist = await response?.data?.data?.artists
  
   
//    const filterArtist = await Promise.all( artist?.map(async (item:any)=>{
//     const search = await wiki.search(item.name);
//     const data = await wiki.page(search?.results[0]?.pageid);
//     const images = item.avatar_images[0]
//     return {
//         name:item.name,
//         image:images,
//         bio:(await data.summary()).extract,
//         url:item.uri
//     }

//    }))
//    const songsResponse = await axios.get(`https://spotify-scraper3.p.rapidapi.com/api/tracks/search?query=${country}%20songs&offset=0&limit=5`,{
//     headers:{
//         "x-rapidapi-host":"spotify-scraper3.p.rapidapi.com",
//         "x-rapidapi-key":config.musicApi.apiKey
//     }
//    })


//    const songs = await songsResponse?.data?.data?.tracks
   
//    return {
//     top_artist:filterArtist,
//     top_songs:songs?.map((item:any)=>({
//         name:item.name,
//         image:item?.album?.cover_images[2]?.url,
//         url:item?.uri
//     }))
//    }

const getSingleCountry = await countriesHelper.countryDetailsFromApi(country)

return `https://charts.spotify.com/charts/overview/${getSingleCountry.cca2}`
   
};

const cultureFromApi = async (country:string) => {
    const culture =await searchHelper.wikiSearchService(`culture of ${country}`,['culture']);
    return culture;
    
};

const jobsFromApi = async (country:string) => {
    // const response = await axios.get(`https://remotive.com/api/remote-jobs?search=${country}&limit=10`)
    // return response.data.jobs

    return `https://www.careerjet.com.bd/jobs?l=${country.toLowerCase().split(' ').join('-')}`
};

const adviseFromApi = async (country:string) => {
   
    return `https://www.nationsonline.org/oneworld/${country.toLowerCase().split(' ').join('_')}.htm`
};

const movingTipsFromApi = async (country:string) => {
    // const data = await adviseFromApi(country)
    // const climate = data?.climate?.climateInfo
    // const entryAndExit = data?.entryExitRequirement

    // return {climate,entryAndExit}
    return `https://www.worldatlas.com/maps/${country.toLowerCase().split(' ').join('-')}`
}
const visaInfoFromApi = async (country:string) => {
    const data = await searchHelper.wikiSearchService(`Visa requirements for ${country}`,['visa',country]);
    return data
};

const dualChitezenShipInfoFromApi = async (country:string) => {
    const data = await searchHelper.wikiSearchService(`${country} nationality law`,[])
    return data
}

const livingCostFromApi = async (country:string) => {
    // const countryData = await countriesHelper.countryDetailsFromApi(country)
    // const capital = countryData?.capital[0]
    // const costs = await axios.get(`https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${capital}&country_name=${country}`,{
    //     headers:{
    //         "x-rapidapi-host":"cost-of-living-and-prices.p.rapidapi.com",
    //         "x-rapidapi-key":config.livingCostApi.apiKey
    //     }
    // })

    // return costs.data

    return `https://www.livingcost.net/${country.toLowerCase().split(' ').join('-')}`
}

const resourceListFromAPi = async (country:string) => {
    // const county = await countriesHelper.countryDetailsFromApi(country)

    
    // const capital = county?.capital[0]
    
    // const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${capital}%2C${country}&format=json&apiKey=${config.locationAPi.geoApiKey}`)
    // const place_id = response?.data?.results[0]?.place_id


    // const resources = await axios.get(`https://api.geoapify.com/v2/places?categories=${catagories}&filter=place:${place_id}&limit=20&apiKey=${config.locationAPi.geoApiKey}`)

    // const features = resources.data?.features
    // return features.map((item:any)=>{
    //     const obj = {
    //         name:item.properties.name,
    //         address:item.properties.formatted,
    //         latitude:item.geometry.coordinates[1],
    //         longitude:item.geometry.coordinates[0],
    //         catageroy:item.properties.categories
    //     }
    //     return obj

    // })

    return `https://www.livingcost.net/${country.toLowerCase().split(' ').join('-')}`
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