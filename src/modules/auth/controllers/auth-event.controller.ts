import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthEventController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern(process.env.RABBITMQ_AUTH_QUEUE)
  handleAuthEvent(@Payload() data: any) {
    console.log('Received event:', data);
    // Handle the event here
  }
}

