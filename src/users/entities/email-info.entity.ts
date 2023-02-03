import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class EmailConfirmationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  confirmationCode: string;
  @Column()
  expirationDate: Date;
  @Column({ default: false })
  isConfirmed: boolean;

  @OneToOne(() => UserEntity, (user) => user.emailConfirmation)
  @JoinColumn()
  user: UserEntity;
  @Column('uuid')
  userId: string;
}
