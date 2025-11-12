import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// User authentication routes
router.post('/register', validate(['firstName', 'email', 'password']), registerUser);
router.post('/login', validate(['email', 'password']), loginUser);

export default router;
