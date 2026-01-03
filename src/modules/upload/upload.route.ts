
import express from 'express';
import { upload } from '../../config/cloudinary.config';
import { UploadController } from './upload.controller';

const router = express.Router();

router.post('/', upload.single('image'), UploadController.uploadImage);

export const UploadRoutes = router;
