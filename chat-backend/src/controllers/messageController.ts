import { Request, Response } from 'express';
import Message from '../models/Message';

// Get all messages between two users
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    res.status(400).json({ message: 'Missing users' });
    return;
  }

  try {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    }).sort({ createdAt: 1 }); // Sort by oldest first

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};