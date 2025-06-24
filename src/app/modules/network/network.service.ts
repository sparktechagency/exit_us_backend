import { countriesHelper } from "../../../helpers/countrysHelper"
import { paginationHelper } from "../../../helpers/paginationHelper"
import { CountryService } from "../countrys/country.service"
import { Move } from "../move/move.model"
import { User } from "../user/user.model"

const topReturnees = async (query:Record<string, any>) => {

    const users = await Move.aggregate([
        { $group: { _id: "$user", totalMoves: { $sum: 1 } } },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $sort: { totalMoves: -1 } },
        { $project: { _id: "$user._id", name: "$user.name", image: "$user.image", totalMoves: 1, email: "$user.email", phone: "$user.phone", country: "$user.country"} },
    ])


    const paginateArray = paginationHelper.paginateArray(users, query)
    return {
        data: paginateArray.data,
        pagination: paginateArray.pagination
    }
    


}

const communitys = async ()=>{
    const groupCountrysUser = await User.aggregate([
        { $group: { _id: "$country", totalUsers: { $sum: 1 } } },
    ])
    const regions = await CountryService.getRegions({})
    let hash:any = {}
    regions.forEach((region:any)=>{
        hash[region] = {totalUsers:0}
    })
    
    let totalCommunitys = 0
    const regionsA = await Promise.all(groupCountrysUser.map(async (country:any)=>{
        const countryDetails = await countriesHelper.countryDetailsFromApi(country._id?.toLowerCase())
        const region = countryDetails?.region
        if(hash[region]){
            hash[region].totalUsers += country.totalUsers
            totalCommunitys += country.totalUsers
        }
        else{
            if(!region) return
            hash[region] = {totalUsers:country.totalUsers}
            totalCommunitys += country.totalUsers
        }
        return true
    }))
    
    return {
        totalCommunitys,
        communitys:hash
    }
}

export const NetworkService = {
    topReturnees,
    communitys
}