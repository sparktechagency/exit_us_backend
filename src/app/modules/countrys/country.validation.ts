import { z } from "zod";
import { COUNTRY_DETAILS_TOPIC } from "../../../enums/countryDetailsTopic";

const getCountryDetailsZodSchema = z.object({
    query: z.object({
        topic:z.nativeEnum(COUNTRY_DETAILS_TOPIC),
        country: z.string({required_error: 'Country is required'})
    }),
});

export const CountryValidation = {
    getCountryDetailsZodSchema
}