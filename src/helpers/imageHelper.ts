import axios from "axios";
import config from "../config";

const getImage = async (name: string,limit:number=10): Promise<string[]> => {
    const response = await axios.get(`https://api.pexels.com/v1/search?query=${name?.toLowerCase()}&per_page=${limit}`,{
        headers: {
            Authorization: config.photosApi.apiKey,
            "X-Ratelimit-Limit":2000000
            
        }
    })
    const images = response.data.photos.filter((item:any)=>item.src.medium).map((item:any)=>item.src.medium)


    return images
};

export const imageHelper = {
    getImage
}