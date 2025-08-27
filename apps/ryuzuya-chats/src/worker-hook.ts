import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./app/worker/worker.module";
import redisConfig from "./app/config/redis.config";
import IORedis from 'ioredis';
import { Job, QueueEvents, Worker } from "bullmq";
import { createClient } from "redis";
import { Emitter } from "@socket.io/redis-emitter";
import { TelegramUpdate } from "./interfaces/chat";
import { ChatService } from "./app/chat/chat.service";
import { IChatMessage } from "./app/chat/interfaces/chat.interface";



async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {});
  const chatService = app.get(ChatService);
  const redisPort = redisConfig().REDIS_PORT;
  const redisHost = redisConfig().REDIS_HOST;
  const redisPassword = redisConfig().REDIS_PASSWORD;
  const redisConnString = `redis://:${redisPassword}@${redisHost}:${redisPort}`;
  console.log(redisConnString);
  const connection = new IORedis(redisConnString, { maxRetriesPerRequest: null });
  const events = new QueueEvents('chat-queue', { connection });
  const redis = createClient({ url: redisConnString });
  await redis.connect();

  const ioRedis = new Emitter(redis, { key: 'chat-key' });

  async function replyToClient(job: Job) {
    const jobData = job.data;
    const telegramPayload: TelegramUpdate = jobData;
    const text = telegramPayload?.message?.text || '';
    const replyToMessage = telegramPayload?.message?.reply_to_message?.text;
    const match = text.match(/\[#(\w{4,})\]/);
    const matchReply = replyToMessage?.match(/\[#(\w{4,})\]/);
    if (!match && !matchReply) return; // ignore unrelated messages

    let conversationId: string;
    if (match?.length > 1) {
      conversationId = match[1];
    }

    if (matchReply?.length > 1) {
      conversationId = matchReply[1];
    }

    const cleanText = text.replace(/\[#\w{4,}\]/g, '').trim();
    const prepareMessge = {
      from: 'admin',
      message: cleanText,
      conversationId,
      profileId: '68a09522a15fa940052244c3',
      sender: '68a09522a15fa940052244c3',
      to: 'visitor_5b1fed68',
      createdAt: new Date().toISOString(),
    }
    ioRedis.to(conversationId).emit('admin:reply', prepareMessge);
    await chatService.saveMessage(prepareMessge);
    console.log('conversationId', conversationId);
  }

  async function saveMessage(job: Job) {
    const jobData: IChatMessage = job.data;
    await chatService.saveMessage(jobData);
  }

  async function jobProcess(job: Job) {
    switch (true) {
      case job.name === 'telegram:hook':
        return replyToClient(job);
      case job.name === 'chat:save':
        return saveMessage(job);
      default:
        break;
    }
  }


  const worker = new Worker(
    'chat-queue',
    jobProcess,
    {
      connection,
      concurrency: 5,
      limiter: {
        max: 100,
        duration: 1000
      }
    }
  )

  worker.on('completed', () => console.log('job completed'));
  worker.on('failed', (_, err) => console.log('job failed', err));
  process.on('SIGINT', async () => { await worker.close(); await events.close(); await connection.quit(); process.exit(0); });
  process.on('SIGTERM', async () => { await worker.close(); await events.close(); await connection.quit(); process.exit(0); });
}

bootstrap();
