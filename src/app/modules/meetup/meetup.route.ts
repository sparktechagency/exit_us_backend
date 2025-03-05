import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { MeetupValidation } from './meetup.validation';
import { MeetupController } from './meetup.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/',auth(USER_ROLES.ADMIN,USER_ROLES.USER),validateRequest(MeetupValidation.createMeetupZodSchema),MeetupController.createMeetup)

router.get('/', MeetupController.getMeetups)

router.get('/get/:id', MeetupController.getMeetupById)

router.put('/:id',auth(USER_ROLES.USER),validateRequest(MeetupValidation.updateMeetupZodSchema), MeetupController.updateMeetup)

router.delete('/:id',auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN), MeetupController.deleteMeetup)

router.get('/user', auth(USER_ROLES.USER),MeetupController.getUserMeetups)

export const MeetupRoutes = router;
