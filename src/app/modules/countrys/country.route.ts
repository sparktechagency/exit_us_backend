

import express from 'express';
import { CountryController } from './country.controller';

const router  = express.Router();

router.get('/top-world',CountryController.topCountersOfWorld)

router.get('/top-regions/:region', CountryController.topCountersOfRegions)

router.get('/single',CountryController.singleCountriesDetails)
router.get('/cities/:country', CountryController.citysOFCountries)

export const CountryRoutes = router