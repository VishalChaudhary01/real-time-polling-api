import { Request, Response } from 'express';
import { CreatePollDto } from '../validators/poll.validator';
import { prisma } from '../config/db.config';
import { AppError } from '../utils/app-error';
import { HttpStatus } from '../config/http.config';
import { socketService } from '../services/web-socket.service';

export async function createPoll(req: Request, res: Response) {
  const data: CreatePollDto = req.body;
  const userId = req.userId;
  if (!userId) {
    throw new AppError('Unauthorized user', HttpStatus.UNAUTHORIZED);
  }

  const poll = await prisma.poll.create({
    data: {
      question: data.question,
      isPublished: data.isPublished,
      creatorId: userId,
      options: {
        create: data.options.map((option) => ({
          text: option.text,
        })),
      },
    },
    select: {
      id: true,
      question: true,
      creatorId: true,
      createdAt: true,
      options: {
        select: {
          id: true,
          text: true,
          _count: { select: { votes: true } },
        },
      },
    },
  });

  res.status(HttpStatus.CREATED).json({
    message: 'Poll created',
    poll,
  });
}

export async function getAllPolls(_req: Request, res: Response) {
  const polls = await prisma.poll.findMany({
    select: {
      id: true,
      question: true,
      creatorId: true,
      createdAt: true,
    },
  });

  res.status(HttpStatus.OK).json({
    message: 'All poll fetch successful',
    polls,
  });
}

export async function getPollById(req: Request, res: Response) {
  const pollId = req.params.pollId;

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: {
      id: true,
      question: true,
      creatorId: true,
      createdAt: true,
      options: {
        select: {
          id: true,
          text: true,
          _count: { select: { votes: true } },
        },
      },
    },
  });
  if (!poll) {
    throw new AppError('Poll not found', HttpStatus.NOT_FOUND);
  }

  res.status(HttpStatus.OK).json({ message: 'Poll fetch successful', poll });
}

export async function submitVote(req: Request, res: Response) {
  const userId = req.userId;
  const pollId = req.params.pollId as string;
  const optionId = req.params.optionId as string;

  if (!userId || !pollId || !optionId) {
    throw new AppError('Invalid request', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  const option = await prisma.pollOption.findFirst({
    where: { id: optionId, pollId },
  });
  if (!option) {
    throw new AppError('Option not found for this poll', HttpStatus.NOT_FOUND);
  }

  const alreadyVoted = await prisma.vote.findFirst({
    where: { userId, optionId },
  });
  if (alreadyVoted) {
    throw new AppError(
      'User already voted for this option',
      HttpStatus.CONFLICT
    );
  }

  await prisma.vote.create({
    data: {
      optionId,
      userId,
    },
  });
  const pollOptions = await prisma.pollOption.findMany({
    where: { pollId },
    select: {
      id: true,
      text: true,
      _count: { select: { votes: true } },
    },
  });

  // Broadcast to pollId room
  socketService.broadcastPollUpdate(pollId, pollOptions);

  res.status(HttpStatus.OK).json({ message: 'Vote added successfully' });
}
