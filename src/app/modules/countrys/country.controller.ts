import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CountryService } from "./country.service";
import sendResponse from "../../../shared/sendResponse";
import { redisHelper } from "../../../helpers/redisHelper";

const topCountersOfWorld = catchAsync(
    async (req:Request, res:Response) => {
        const url = req.originalUrl
        const query:any = req.query
        const countries = await CountryService.topCountersOfWorld(query)
        const response = {
            success: true,
            statusCode: 200,
            message: "Top countries retrieved successfully",
            data: countries.data,
            pagination:countries.pagination
        }
        await redisHelper.client.set(url,JSON.stringify(response),"EX",1000000000000)
        sendResponse(res,response )
    }
)
const topCountersOfRegions = catchAsync(
    async (req:Request, res:Response) => {
        const url = req.originalUrl
        const query:any = req.query
        const region:string = req.params.region
        const countries = await CountryService.topCountersOfRegions(region, query)
        const response = {
            success: true,
            statusCode: 200,
            message: "Top countries retrieved successfully",
            data: countries.data,
            pagination:countries.pagination
        }
        await redisHelper.client.set(url,JSON.stringify(response),"EX",1000000000000)
        sendResponse(res,response )
    }
)
const singleCountriesDetails = catchAsync(
    async (req:Request, res:Response) => {
        const query = req.query
        const country = await CountryService.singleCountriesDetails(query)
        const response = {
            success: true,
            statusCode: 200,
            message: "Country details retrieved successfully",
            data: country
        }
        await redisHelper.set(req.originalUrl,response)
        sendResponse(res,response)
    }
)
const citysOFCountries = catchAsync(
    async (req:Request, res:Response) => {
        const query = req.query
        const country = req.params.country
        const cities = await CountryService.getCitysByCountry(country,query)
        const response = {
            success: true,
            statusCode: 200,
            message: "Citys of countries retrieved successfully",
            data: cities.data,
            pagination:cities.pagination
        }
        await redisHelper.set(req.originalUrl,response)
        sendResponse(res,response )
    }
)

const getCountrys = catchAsync(
    async (req:Request, res:Response) => {
        const countries = await CountryService.getCountrysFromApi()
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Countrys retrieved successfully",
            data: countries
        })
    }
)

const ethenitys = catchAsync(
    async (req:Request, res:Response) => {
        const ethenitys = await CountryService.getEthenity()
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Ethenitys retrieved successfully",
            data: ethenitys
        })
    }
)

const getRegions = catchAsync(
    async (req:Request, res:Response) => {
        const query = req.query
        const regions = await CountryService.getRegions(query)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Regions retrieved successfully",
            data: regions
        })
    }
)

const countryDetails = catchAsync(
    async (req:Request, res:Response) => {
        const query:any = req.query
        const country = await CountryService.countryDetailsFromApi(query.topic||"",query.country||"")
        const response = {
            success: true,
            statusCode: 200,
            message: "Country details retrieved successfully",
            data: country
        }
        redisHelper.set(req.originalUrl,response)
        sendResponse(res,response )
    }
)

const getCityDetails = catchAsync(
    async (req:Request, res:Response) => {
        const query:any = req.query.city
        const city = await CountryService.getSingleCiyDetails(query)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "City details retrieved successfully",
            data: city
        })
    }
)
export const CountryController={
    topCountersOfWorld,
    topCountersOfRegions,
    singleCountriesDetails,
    citysOFCountries,
    getCountrys,
    ethenitys,
    getRegions,
    countryDetails,
    getCityDetails
 
}