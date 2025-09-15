import { WebSocket, WebSocketServer } from 'ws';
import { Server as HttpServer, IncomingMessage } from 'http';
import { createClient, RedisClientType } from 'redis';
import { Env } from '../config/env.config';

export interface PollOption {
  id: string;
  text: string;
  _count: {
    votes: number;
  };
}

class SocketServer {
  private static instance: SocketServer;
  private wss!: WebSocketServer;

  private publisher!: RedisClientType;
  private subscriber!: RedisClientType;

  private pollChannels!: Map<string, Set<WebSocket>>;

  private constructor() {}

  public init(httpServer: HttpServer) {
    this.wss = new WebSocketServer({ server: httpServer });

    this.publisher = createClient({ url: Env.REDIS_URL });
    this.subscriber = createClient({ url: Env.REDIS_URL });

    this.pollChannels = new Map();

    this.setupWebSocketServer();
    this.setupRedis();
  }

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer();
    }
    return SocketServer.instance;
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket, _req: IncomingMessage) => {
      console.log('Client connected');

      ws.on('message', (rawData) => {
        try {
          const message = JSON.parse(rawData.toString());
          const channel = `poll-${message.pollId}`;

          switch (message.type) {
            case 'subscribe':
              this.subscribeToPoll(ws, channel);
              break;
            case 'unsubscribe':
              this.unsubscribeFromPoll(ws, channel);
              break;
            case 'publish':
              this.publishToPoll(channel, message.data);
              break;
            default:
              console.warn('Unknown message type:', message.type);
          }
        } catch (err) {
          console.error('Invalid WS message', err);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');

        this.pollChannels.forEach((clients, channel) => {
          clients.delete(ws);
          if (clients.size === 0) {
            this.pollChannels.delete(channel);
            this.subscriber.unsubscribe(channel);
          }
        });
      });
    });
  }

  private async setupRedis() {
    try {
      await this.subscriber.connect();
      await this.publisher.connect();
      console.log('Redis connected');
    } catch (err) {
      console.error('Redis connection failed:', err);
    }
  }

  private subscribeToPoll(ws: WebSocket, channel: string) {
    if (!this.pollChannels.has(channel)) {
      this.pollChannels.set(channel, new Set());

      this.subscriber.subscribe(channel, (message: string) => {
        const clients = this.pollChannels.get(channel);
        if (clients) {
          for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          }
        }
      });
    }

    this.pollChannels.get(channel)!.add(ws);
    console.log(`Client subscribed to ${channel}`);
  }

  private unsubscribeFromPoll(ws: WebSocket, pollId: string) {
    const channel = `poll-${pollId}`;
    const clients = this.pollChannels.get(channel);

    if (clients) {
      clients.delete(ws);
      if (clients.size === 0) {
        this.pollChannels.delete(channel);
        this.subscriber.unsubscribe(channel);
      }
    }
  }

  private publishToPoll(channel: string, data: any) {
    this.publisher.publish(channel, JSON.stringify(data));
  }

  public broadcastPollUpdate(pollId: string, pollOptions: PollOption[]) {
    const channel = `poll-${pollId}`;
    this.publishToPoll(channel, {
      type: 'voteUpdated',
      pollId,
      options: pollOptions,
    });
  }
}

export const socketService = SocketServer.getInstance();
