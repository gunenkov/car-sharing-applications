import { Injectable } from '@nestjs/common';
import { NewApplicationInput } from './dto/new-application.input';
import { Application } from './models/application.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Connection from 'rabbitmq-client';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
  ) {}

  async onApplicationBootstrap() {
    const rabbit = new Connection({
      url: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
    });

    rabbit.on('connection', () => {
      console.log('The connection to RMQ is successfully (re)established');
    });

    const ch = await rabbit.acquire();

    await ch.queueDeclare({ queue: 'drives-accept' });

    await ch.basicConsume({ queue: 'drives-accept' }, async (msg) => {
      const id = JSON.parse(msg.body).id;
      const application = await this.applicationsRepository.findOne({
        where: {
          id: id,
        },
      });
      if (application) {
        console.log('Founded application');
        application.accepted = true;
        await this.applicationsRepository.save(application);
      }

      ch.basicAck({ deliveryTag: msg.deliveryTag });
    });
  }

  async create(data: NewApplicationInput): Promise<Application> {
    let a = new Application();
    a.startId = data.startId;
    a.finishId = data.finishId;
    a.wishes = data.wishes;
    a.date = data.date;
    await this.applicationsRepository.save(a);
    return a;
  }

  async findAll(): Promise<Application[]> {
    return await this.applicationsRepository.find();
  }
}
