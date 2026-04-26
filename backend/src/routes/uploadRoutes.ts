import express from 'express';
import { upload } from '../middlewares/uploadMiddleware';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.post('/file', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/submissions/${req.file.filename}`;
  res.status(200).json({
    success: true,
    data: {
      fileUrl,
      fileName: req.file.originalname,
      fileSize: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB'
    }
  });
});

export default router;
