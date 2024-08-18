import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  Transport,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private client: ClientProxy;
  private isConnected = false;
  private readonly maxRetryAttempts = 10;
  private readonly retryDelay = 5000;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      //   const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');
      //   const authQueue = this.configService.get<string>('RABBITMQ_AUTH_QUEUE');

      this.client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.RABBITMQ_AUTH_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      });

      await this.client.connect();
      this.isConnected = true;
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      this.isConnected = false;
      this.retryConnection();
    }
  }

  private retryConnection(attempts = 0) {
    setTimeout(async () => {
      try {
        await this.connect();
        return;
      } catch (error) {
        if (attempts < this.maxRetryAttempts) {
          console.log(
            `Retry attempt ${attempts + 1} of ${this.maxRetryAttempts}`,
          );
          this.retryConnection(attempts + 1);
        } else {
          console.error(
            `Max retry attempts (${this.maxRetryAttempts}) reached. Could not reconnect to RabbitMQ.`,
          );
        }
      }
    }, this.retryDelay);
  }

  getClient(): ClientProxy {
    if (!this.isConnected) {
      throw new Error('RabbitMQ client is not connected.');
    }
    return this.client;
  }
}
