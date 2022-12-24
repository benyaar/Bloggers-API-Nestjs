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
} from '@nestjs/common';

import { UsersService } from './users.service';
import { InputUserDto } from './dto/input-user.dto';
import { QueryUsersRepository } from './query-users.repository';
import { PaginationInputDTO } from '../helpers/dto/helpers.dto';

@Controller('users')
export class UsersController {
  constructor(
    public usersService: UsersService,
    public queryUserRepository: QueryUsersRepository,
  ) {}

  @Post()
  async createUser(@Body() inputUserDto: InputUserDto) {
    return this.usersService.createUser(inputUserDto);
  }
  @Get()
  //getUsers(@Query('term') term: string ) - или так getUsers(@Query() query: Type )
  async findAllUsers(@Query() paginationInputDTO: PaginationInputDTO) {
    return this.queryUserRepository.findAllUsers(paginationInputDTO);
  }
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const findUserById = await this.queryUserRepository.findUserById(id);
    if (!findUserById) throw new NotFoundException([]);
    return findUserById;
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteUserById(@Param('id') id: string) {
    const findUserById = await this.queryUserRepository.findUserById(id);
    if (!findUserById) throw new NotFoundException([]);
    return this.usersService.deleteUserById(id);
  }
}
