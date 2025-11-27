import express, { RequestHandler } from 'express';
import { register, login, getUsers, deleteUser, makeAdmin, removeAdmin, updateUser } from '../controllers/authController';

const router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.get('/users', getUsers as RequestHandler);
router.delete('/users/:email', deleteUser as RequestHandler);
router.post('/users/make-admin', makeAdmin as RequestHandler);
router.post('/users/remove-admin', removeAdmin as RequestHandler);
router.put('/users/:email', updateUser as RequestHandler);

export default router;