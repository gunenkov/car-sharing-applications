import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ApplicationsFilterInput {
  @Field({ nullable: true })
  startId: number;

  @Field({ nullable: true })
  finishId: number;

  @Field({ nullable: true })
  date: Date;

  @Field({ nullable: true })
  accepted: boolean;
}
