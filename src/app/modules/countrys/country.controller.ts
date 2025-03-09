import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CountryService } from "./country.service";
import sendResponse from "../../../shared/sendResponse";

const topCountersOfWorld = catchAsync(
    async (req:Request, res:Response) => {
        const query:any = req.query
        const countries = await CountryService.topCountersOfWorld(query.amount!)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Top countries retrieved successfully",
            data: countries
        })
    }
)
const topCountersOfRegions = catchAsync(
    async (req:Request, res:Response) => {
        const query:any = req.query
        const region:string = req.params.region
        const countries = await CountryService.topCountersOfRegions(region, query.amount!)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Top countries retrieved successfully",
            data: countries
        })
    }
)
const singleCountriesDetails = catchAsync(
    async (req:Request, res:Response) => {
        const query = req.query
        const country = await CountryService.singleCountriesDetails(query)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Country retrieved successfully",
            data: country
        })
    }
)
const citysOFCountries = catchAsync(
    async (req:Request, res:Response) => {
        const query = req.query
        const country = req.params.country
        const cities = await CountryService.getCitysByCountry(country,query)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Citys of countries retrieved successfully",
            data: cities
        })
    }
)
export const CountryController={
    topCountersOfWorld,
    topCountersOfRegions,
    singleCountriesDetails,
    citysOFCountries,
 
}