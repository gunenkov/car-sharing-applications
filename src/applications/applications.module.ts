import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsResolver } from './applications.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './models/application.model';

@Module({
  providers: [ApplicationsService, ApplicationsResolver],
  imports: [TypeOrmModule.forFeature([Application])],
})
export class ApplicationsModule {}
