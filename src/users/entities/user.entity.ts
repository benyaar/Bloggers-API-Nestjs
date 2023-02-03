import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailConfirmationEntity } from './email-info.entity';
import { BanInfoEntity } from './ban-info.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  createdAt: Date;

  @OneToOne(() => EmailConfirmationEntity, (ec) => ec.user)
  emailConfirmation: EmailConfirmationEntity;

  @OneToOne(() => BanInfoEntity, (be) => be.user)
  banInfo: BanInfoEntity;
}
