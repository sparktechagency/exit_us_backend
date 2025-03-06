

import express from 'express';
import { uploadChunkMiddleware } from '../../middlewares/chunkUploadHandler';
import { ReelController } from './reel.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ReelValidation } from './reel.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';


const router = express.Router();

router.post('/',auth(USER_ROLES.USER),uploadChunkMiddleware,validateRequest(ReelValidation.createReelZodSchema),ReelController.postReel)

router.get('/', ReelController.getReels)

router.post('/like', auth(USER_ROLES.USER),validateRequest(ReelValidation.likeReelZodSchema), ReelController.likeReel)

router.post('/comment', auth(USER_ROLES.USER),validateRequest(ReelValidation.createCommentZodSchema), ReelController.commentOnReel)

router.get('/comment/:reelId', ReelController.getAllCommentsToDB)

router.delete("/comment/:commentId", auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN), ReelController.deleteComment)

export const ReelRoutes = router;