import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class BanInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ default: null })
  banDate: Date | null;
  @Column({ default: null })
  banReason: string | null;
  @Column({ default: false })
  isBanned: boolean;

  @OneToOne(() => UserEntity, (user) => user.banInfo)
  @JoinColumn()
  user: UserEntity;
  @Column('uuid')
  userId: string;
}
