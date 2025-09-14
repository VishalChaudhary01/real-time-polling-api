import { Router } from 'express';
import {
  createPoll,
  getAllPolls,
  getPollById,
  submitVote,
} from '../controllers/poll.controller';
import { inputValidator } from '../middlewares/input-validarot';
import { createPollSchema } from '../validators/poll.validator';

const pollRoutes = Router();

pollRoutes.post('/', inputValidator(createPollSchema), createPoll);
pollRoutes.get('/', getAllPolls);
pollRoutes.get('/:pollId', getPollById);

pollRoutes.post('/:pollId/vote/:optionId', submitVote);

export default pollRoutes;
