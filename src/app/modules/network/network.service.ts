import { USER_ROLES } from "../../../enums/user"
import { countriesHelper } from "../../../helpers/countrysHelper"
import { paginationHelper } from "../../../helpers/paginationHelper"
import QueryBuilder from "../../builder/QueryBuilder"
import { CountryService } from "../countrys/country.service"
import { Move } from "../move/move.model"
import { User } from "../user/user.model"

const topReturnees = async (query:Record<string, any>) => {

    const UserQuery = new QueryBuilder(User.find({verified:true,role:USER_ROLES.USER}),query).paginate()
    const [users,pagination] = await Promise.all([
        UserQuery.modelQuery.lean(),
        UserQuery.getPaginationInfo()
    ])

    return {
        data: users,
        pagination
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