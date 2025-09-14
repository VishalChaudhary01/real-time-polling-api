import { Router } from 'express';
import { signin, signout, signup } from '../controllers/auth.controller';
import { authRequire } from '../middlewares/auth-require';
import { inputValidator } from '../middlewares/input-validarot';
import { signinSchema, signupSchema } from '../validators/auth.validator';

const authRoutes = Router();

authRoutes.post('/signup', inputValidator(signupSchema), signup);
authRoutes.post('/signin', inputValidator(signinSchema), signin);

authRoutes.post('/signout', authRequire, signout);

export default authRoutes;
