import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../repository/users.sql.repository';
import {
  BanInfo,
  EmailConfirmation,
  UsersDocument,
  UserViewType,
} from '../schemas/user.schema';
import { InputUserDto } from '../dto/input-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersQueryRepository } from '../repository/users.query-repository';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../email/email.service';
import { CreateNewPasswordDto } from '../../auth/dto/create-new-password.dto';
import { RecoveryCodeType } from '../schemas/recovery-code.schema';
import { BanUserDto } from '../dto/ban-user.dto';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { BloggersQueryRepository } from '../../bloggers/repository/bloggers.query-repository';
import { BanBlogDto } from '../../bloggers/dto/input-bloggers.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private emailService: EmailService,
    private blogQueryRepository: BloggersQueryRepository,
  ) {}
  async createUser(inputUserDTO: InputUserDto) {
    const findUserByLogin = await this.usersQueryRepository.findUserByLogin(
      inputUserDTO.login,
    );
    if (findUserByLogin)
      throw new BadRequestException([
        { message: 'Invalid login', field: 'login' },
      ]);
    const findUserByEmail = await this.usersQueryRepository.findUserByEmail(
      inputUserDTO.email,
    );
    if (findUserByEmail)
      throw new BadRequestException([
        { message: 'Invalid email', field: 'email' },
      ]);

    const password = inputUserDTO.password;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const code = uuidv4();
    const createNewUser = new UserViewType(
      uuidv4(),
      inputUserDTO.login,
      inputUserDTO.email,
      hash,
      new Date(),
      {
        confirmationCode: code,
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
      { banDate: null, banReason: null, isBanned: false },
    );
    await this.usersRepository.createUser(createNewUser);
    const { passwordHash, emailConfirmation, ...userViewModal } = createNewUser;
    const bodyTextMessage = `https://somesite.com/confirm-email?code=${createNewUser.emailConfirmation.confirmationCode}`;
    await this.emailService.sendEmail(
      inputUserDTO.email,
      'confirm email',
      bodyTextMessage,
    );
    return userViewModal;
  }

  async deleteUserById(id: string) {
    return this.usersRepository.deleteUserById(id);
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail);
  }

  async updateUserEmailConfirm(user: UsersDocument) {
    const code = uuidv4();

    const newEmailConfirmation: EmailConfirmation = {
      confirmationCode: code,
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 3,
      }),
      isConfirmed: false,
    };

    await this.usersRepository.updateEmailConfirmation(
      user,
      newEmailConfirmation,
    );

    const bodyTextMessage = `https://somesite.com/confirm-email?code=${newEmailConfirmation.confirmationCode}`;
    await this.emailService.sendEmail(
      user.email,
      'Confirm email',
      bodyTextMessage,
    );
    return;
  }

  async findUserByConfirmCode(code: string) {
    const findUserByConfirmCode =
      await this.usersQueryRepository.findUserByConfirmCode(code);
    if (!findUserByConfirmCode)
      throw new BadRequestException([
        { message: 'not found user by code', field: 'code' },
      ]);
    if (findUserByConfirmCode.emailConfirmation.isConfirmed)
      throw new BadRequestException([
        { message: 'code is confirmed', field: 'code' },
      ]);

    return this.usersRepository.updateConfirmCode(findUserByConfirmCode);
  }

  async passwordRecovery(email: string) {
    const findUserByEmail = await this.usersQueryRepository.findUserByEmail(
      email,
    );
    if (!findUserByEmail) throw new NotFoundException([]);

    const recoveryCode: RecoveryCodeType = {
      email: email,
      recoveryCode: uuidv4(),
    };
    await this.usersRepository.passwordRecovery(recoveryCode);
    const bodyTextMessage = `https://somesite.com/password-recovery?recoveryCode=${recoveryCode.recoveryCode}`;
    await this.emailService.sendEmail(
      email,
      'Recovery password',
      bodyTextMessage,
    );
    return;
  }

  async createNewPassword(password: CreateNewPasswordDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password.newPassword, salt);

    const findRecoveryCode = await this.usersQueryRepository.findRecoveryCode(
      password.recoveryCode,
    );
    if (!findRecoveryCode) throw new BadRequestException([]);
    const findUserByEmail = await this.usersQueryRepository.findUserByEmail(
      findRecoveryCode.email,
    );
    if (!findUserByEmail) throw new BadRequestException([]);
    findUserByEmail.passwordHash = hash;
    await this.usersRepository.updateUserHash(findUserByEmail, hash);
    return;
  }

  async findUserById(id: string) {
    return this.usersRepository.findUserById(id);
  }

  async banUserById(id: string, banUserDto: BanUserDto) {
    const banUserInfo: BanInfo = banUserDto.isBanned
      ? {
          banDate: new Date(),
          banReason: banUserDto.banReason,
          isBanned: banUserDto.isBanned,
        }
      : { banDate: null, banReason: null, isBanned: banUserDto.isBanned };

    const findUserById = await this.findUserById(id);
    if (!findUserById) throw new NotFoundException([]);

    return this.usersRepository.banUserById(id, banUserInfo);
  }

  async findBlogsWithOwnerId(paginationDto: PaginationInputDTO) {
    return await this.blogQueryRepository.findAllBlogs(
      paginationDto,
      null,
      'admin',
    );
  }

  async banBlogById(id: string, banDto: BanBlogDto) {
    return this.blogQueryRepository.banBlogById(id, banDto);
  }
}
