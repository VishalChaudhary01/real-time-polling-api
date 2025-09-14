import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { Env } from './config/env.config';
import { AppError } from './utils/app-error';
import { errorHandler } from './middlewares/error-handler';
import { HttpStatus } from './config/http.config';
import { connectDatabase } from './config/db.config';
import appRoutes from './routes';

const app = express();

app.use(cookieParser());
app.use(express.json());

const PORT = Env.PORT;

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Healthy Server!' });
});

app.use('/api/v1', appRoutes);

app.use((req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(`API path ${req.path} not found`, HttpStatus.NOT_FOUND);
});

app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`Server running at http://localhost:${PORT}`);
});
