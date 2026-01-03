import { Request, Response } from 'express';
import { cloudinary } from '../../config/cloudinary.config';

const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  // Use upload_stream to upload the buffer from memory
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'events' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed',
          error: error
        });
      }

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: result?.secure_url,
        },
      });
    }
  );

  // Pipe the buffer to the stream
  stream.end(req.file.buffer);
};

export const UploadController = {
  uploadImage,
};
