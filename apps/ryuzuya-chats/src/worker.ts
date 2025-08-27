import { Worker, QueueEvents, Job } from "bullmq";
import IORedis from 'ioredis';
import redisConfig from "./app/config/redis.config";
import axios from "axios";
import appConfig from "./app/config/app.config";
import { NestFactory } from "@nestjs/core";
import { IntegrationModule } from "./app/integrations/integration.module";
import { IntegrationService } from "./app/integrations/integration.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(IntegrationModule, { logger: ['error', 'warn', 'log'] });
  const integrationService = app.get(IntegrationService);
  const redisPort = redisConfig().REDIS_PORT;
  const redisHost = redisConfig().REDIS_HOST;
  const redisPassword = redisConfig().REDIS_PASSWORD

  const connection = new IORedis(`redis://:${redisPassword}@${redisHost}:${redisPort}`, { maxRetriesPerRequest: null });
  const events = new QueueEvents('telegram', { connection });

  async function sendBatchToTelegram(job: Job) {
    const jobData = job.data;
    const telegramAPI = appConfig().TELEGRAM_API;
    const telegramCred = await integrationService.findByUserChannel(
      jobData.profileId,
      'telegram'
    );
    const token = telegramCred.creds?.token;
    const chatId = telegramCred.creds?.chatId;
    await axios.post(`${telegramAPI}/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: jobData.message,
      });
  }

  const worker = new Worker(
    'telegram',
    sendBatchToTelegram,
    {
      connection,
      concurrency: 1,
      limiter: {
        max: 1,
        duration: 10_000
      }
    }
  )

  worker.on('completed', () => console.log('job completed'));
  worker.on('failed', () => console.log('job failed'));
  process.on('SIGINT', async () => { await worker.close(); await events.close(); await connection.quit(); process.exit(0); });
  process.on('SIGTERM', async () => { await worker.close(); await events.close(); await connection.quit(); process.exit(0); });
}

bootstrap()


