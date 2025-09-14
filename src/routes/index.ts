import { Router } from 'express';
import authRoutes from './auth.route';
import { authRequire } from '../middlewares/auth-require';
import userRoutes from './user.route';
import pollRoutes from './poll.route';

const appRoutes = Router();

appRoutes.use('/auth', authRoutes);
appRoutes.use('/users', authRequire, userRoutes);
appRoutes.use('/polls', authRequire, pollRoutes);

export default appRoutes;
