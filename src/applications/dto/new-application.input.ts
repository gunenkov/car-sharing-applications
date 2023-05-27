import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class NewApplicationInput {
  @Field()
  startId: number;

  @Field()
  finishId: number;

  @Field()
  date: Date;

  @Field({ nullable: true })
  @IsOptional()
  @Length(10, 255)
  wishes?: string;
}
