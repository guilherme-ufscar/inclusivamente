import { Router } from 'express';
import multer from 'multer';
import { uploadImage, getImages, deleteImage, renameImage } from './uploads.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(authenticate);

router.post('/', authorize(['admin']), upload.single('image'), uploadImage);
router.get('/', authorize(['admin']), getImages);
router.delete('/:filename', authorize(['admin']), deleteImage);
router.put('/:filename', authorize(['admin']), renameImage);

export default router;
