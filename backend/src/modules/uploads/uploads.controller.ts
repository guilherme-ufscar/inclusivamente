import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const UPLOADS_DIR = path.join(__dirname, '../../../../uploads/images');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toFile(outputPath);

    const url = `/uploads/images/${filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        filename,
        url
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image.' });
  }
};

export const getImages = (req: Request, res: Response): void => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      res.status(200).json({ success: true, data: [] });
      return;
    }
    
    const files = fs.readdirSync(UPLOADS_DIR);
    const images = files.map(file => {
      const stats = fs.statSync(path.join(UPLOADS_DIR, file));
      return {
        filename: file,
        url: `/uploads/images/${file}`,
        size: stats.size,
        createdAt: stats.birthtime
      };
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ success: false, message: 'Failed to get images.' });
  }
};

export const deleteImage = (req: Request, res: Response): void => {
  try {
    const filename = req.params.filename as string;
    const filePath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ success: true, message: 'Image deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Image not found.' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image.' });
  }
};

export const renameImage = (req: Request, res: Response): void => {
  try {
    const filename = req.params.filename as string;
    const { newFilename } = req.body;
    
    if (!newFilename) {
      res.status(400).json({ success: false, message: 'New filename is required.' });
      return;
    }

    const finalNewFilename = newFilename.endsWith('.webp') ? newFilename : `${newFilename}.webp`;

    const oldPath = path.join(UPLOADS_DIR, filename);
    const newPath = path.join(UPLOADS_DIR, finalNewFilename);

    if (!fs.existsSync(oldPath)) {
      res.status(404).json({ success: false, message: 'Image not found.' });
      return;
    }

    if (fs.existsSync(newPath)) {
      res.status(400).json({ success: false, message: 'A file with the new name already exists.' });
      return;
    }

    fs.renameSync(oldPath, newPath);

    res.status(200).json({
      success: true,
      message: 'Image renamed successfully.',
      data: {
        filename: finalNewFilename,
        url: `/uploads/images/${finalNewFilename}`
      }
    });

  } catch (error) {
    console.error('Error renaming image:', error);
    res.status(500).json({ success: false, message: 'Failed to rename image.' });
  }
};
