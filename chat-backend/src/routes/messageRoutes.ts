import express, { RequestHandler } from 'express';
import { getMessages } from '../controllers/messageController';

const router = express.Router();

router.get('/', getMessages as RequestHandler);

export default router;
