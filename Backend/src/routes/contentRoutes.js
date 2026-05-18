import express from 'express';
import { generateContentHandler } from '../controllers/contentController.js';

const router = express.Router();

router.post('/generate', generateContentHandler);

export default router;