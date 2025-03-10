import { Types } from "mongoose";
import { IMove } from "./move.interface";
import { Move } from "./move.model";
import { countriesHelper } from "../../../helpers/countrysHelper";

async function moveCountry(details:Partial<IMove>,user:Types.ObjectId) {
    const originRegion = await countriesHelper.countryDetailsFromApi(details.originCountry!)
    const destinationRegion = await countriesHelper.countryDetailsFromApi(details.destinationCountry!)
    const movingDetails = await Move.create({
        ...details,
        user,
        originRegion: originRegion.region,
        destinationRegion: destinationRegion.region,
        checkout_date:details.checkout_date
    })
    return movingDetails;
}

export const MoveService = {
    moveCountry
}