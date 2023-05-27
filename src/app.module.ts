import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApplicationsModule } from './applications/applications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './applications/models/application.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ApplicationsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
      csrfPrevention: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: +configService.get<number>('PG_PORT'),
        username: configService.get('PG_USER'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DB'),
        entities: [Application],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
