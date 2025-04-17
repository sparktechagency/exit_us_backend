

import express from 'express';
import { uploadChunkMiddleware } from '../../middlewares/chunkUploadHandler';
import { ReelController } from './reel.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ReelValidation } from './reel.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import tempAuth from '../../middlewares/tempAuth';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads','video')),
    filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });
const router = express.Router();

router.post('/',auth(),upload.single('chunk'),ReelController.postReel)

router.get('/',tempAuth(USER_ROLES.USER), ReelController.getReels)

router.post('/like', auth(USER_ROLES.USER),validateRequest(ReelValidation.likeReelZodSchema), ReelController.likeReel)

router.post('/comment', auth(USER_ROLES.USER),validateRequest(ReelValidation.createCommentZodSchema), ReelController.commentOnReel)

router.get('/comment/:reelId', ReelController.getAllCommentsToDB)

router.delete("/comment/:commentId", auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN), ReelController.deleteComment)

router.get('/video/:url', ReelController.getVideoStrem)
export const ReelRoutes = router;