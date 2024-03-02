import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user-posts' })
export class PostAggEntity {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  userId: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
