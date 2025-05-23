import { Router } from 'express';
import multer from 'multer';
import { uploadController } from './upload.controller';
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post('/upload', upload.single('file'), uploadController);
export default router;
