

import express from 'express';
import { CountryController } from './country.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { MovingValidation } from '../move/move.validation';
import { MoveController } from '../move/move.controller';
import { redisCacheHandler } from '../../middlewares/redisCacheHendler';

const router  = express.Router();

router.get('/top-world',redisCacheHandler,CountryController.topCountersOfWorld)

router.get('/top-regions/:region',redisCacheHandler, CountryController.topCountersOfRegions)

router.get('/single',CountryController.singleCountriesDetails)
router.get('/cities/:country',redisCacheHandler, CountryController.citysOFCountries)

router.post("/move",auth(USER_ROLES.USER),validateRequest(MovingValidation.createMovingFromCountryZodSchema),MoveController.moveFromCountry)

export const CountryRoutes = router