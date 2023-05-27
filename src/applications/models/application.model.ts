import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ description: 'application' })
@Entity()
export class Application {
  @Field()
  @Column()
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Field()
  @Column({
    nullable: false,
  })
  startId: number;

  @Field()
  @Column({
    nullable: false,
  })
  finishId: number;

  @Field()
  @Column({
    nullable: false,
  })
  date: Date;

  @Field({ nullable: true })
  @Column({
    nullable: true,
  })
  wishes?: string;

  @Field()
  @Column({
    nullable: false,
  })
  accepted: boolean = false;
}
