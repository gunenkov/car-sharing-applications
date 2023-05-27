import { Injectable } from '@nestjs/common';
import { NewApplicationInput } from './dto/new-application.input';
import { Application } from './models/application.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Connection from 'rabbitmq-client';
import { ApplicationsFilterInput } from './dto/applications-filter.input';

@Injectable()
export class ApplicationsService {
  private acceptQueue: string = 'drives-accept';
  private notificationQueue: string = 'drives-notification';
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

    await ch.queueDeclare({ queue: this.acceptQueue });
    await ch.queueDeclare({ queue: this.notificationQueue });

    await ch.basicConsume({ queue: this.acceptQueue }, async (msg) => {
      console.log(msg.body);
      const data = { ...JSON.parse(msg.body) };
      const application = await this.applicationsRepository.findOne({
        where: {
          id: data.applicationId,
        },
      });
      if (application) {
        console.log('Founded application');
        application.accepted = true;
        await this.applicationsRepository.save(application);
        await ch.basicPublish({ routingKey: this.notificationQueue }, data);
      }

      ch.basicAck({ deliveryTag: msg.deliveryTag });
    });
  }

  async create(data: NewApplicationInput): Promise<Application> {
    let a = { ...data } as Application;
    await this.applicationsRepository.save(a);
    return a;
  }

  async findAll(): Promise<Application[]> {
    return await this.applicationsRepository.find();
  }

  async findByFilter(data: ApplicationsFilterInput): Promise<Application[]> {
    return await this.applicationsRepository.find({
      where: data,
    });
  }
}
