import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '../application/users.service';
import { InputUserDto } from '../dto/input-user.dto';
import { UsersQueryRepository } from '../repository/users.query-repository';
import {
  PaginationInputDTO,
  PaginationUserInputDTO,
} from '../../helpers/dto/helpers.dto';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';

@Controller('/sa/users')
export class UsersController {
  constructor(
    public usersService: UsersService,
    public queryUserRepository: UsersQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() inputUserDto: InputUserDto) {
    return this.usersService.createUser(inputUserDto);
  }

  @Get()
  async findAllUsers(@Query() paginationInputDTO: PaginationUserInputDTO) {
    return this.queryUserRepository.findAllUsers(paginationInputDTO);
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const findUserById = await this.queryUserRepository.findUserById(id);
    if (!findUserById) throw new NotFoundException([]);
    return findUserById;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUserById(@Param('id') id: string) {
    const findUserById = await this.queryUserRepository.findUserById(id);
    if (!findUserById) throw new NotFoundException([]);
    return this.usersService.deleteUserById(id);
  }
}
