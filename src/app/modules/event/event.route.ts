import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { EventController } from './event.controller';
import validateRequest from '../../middlewares/validateRequest';
import { EventValidation } from './event.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import tempAuth from '../../middlewares/tempAuth';

const router = express.Router();
// events details should formData
router.post('/',auth(USER_ROLES.USER),fileUploadHandler(),validateRequest(EventValidation.createEventZodSchema),EventController.createEvent)

router.get('/user/:id',tempAuth(),EventController.getUserEvents)

router.get('/get/:id', EventController.getEvent)

// events details should formData
router.put('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.USER), fileUploadHandler(), validateRequest(EventValidation.updateEventZodSchema), EventController.updateEvent)

router.delete('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.USER), EventController.deleteEvent)

router.get('/', EventController.getAllEvents)

export const EventRoutes = router;