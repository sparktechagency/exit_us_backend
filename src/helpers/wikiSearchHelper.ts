import wiki from "wikipedia"
import ApiError from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import path from "path";

const wikiSearchService = async (searchTerm: string,keyword:string[]=[]) => {
    const search = await wiki.search(searchTerm?.toLowerCase(), { limit: 10 });

    
    
    const searchData = search.results.filter((item)=>!keyword.length || item.title?.toLowerCase()?.split(' ')?.some((item2:any)=>keyword?.includes(item2)))


    if (searchData.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'No data found');
    }

    const data = await Promise.all(
        searchData.map(async (item) => {
            
            const details = await wiki.page(item.pageid);
            const tables = await details.tables()
            const contents = await details.content()
            
            let images:any = []
         try {
           images = await details.images()
            
            if(images.length){
                images = images?.filter((item: any) => ['.jpg', '.png', '.gif', '.webp'].includes(path.extname(item.url))).map((item:any)=>item.url)
            
            }
         } catch (error) {
            return {
                name: item.title,
                details: (await details.summary()).extract,
            }
         }
         const data2 = {
            name: item.title,
            images: images,
            details: (await details.summary()).extract,
            tables:searchTerm.toLowerCase().includes('visa')?tables:[],
            contents:searchTerm.toLowerCase().includes('law')?contents:[]
        };
        
        return data2
          
        })
    )

    return data

}

export const searchHelper = {
    wikiSearchService
}