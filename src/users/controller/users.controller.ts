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

import { UsersService } from '../application/users.service';
import { InputUserDto } from '../dto/input-user.dto';
import { UsersQueryRepository } from '../repository/users.query-repository';
import {
  PaginationInputDTO,
  PaginationUserInputDTO,
} from '../../helpers/dto/helpers.dto';

@Controller('users')
export class UsersController {
  constructor(
    public usersService: UsersService,
    public queryUserRepository: UsersQueryRepository,
  ) {}

  @Post()
  async createUser(@Body() inputUserDto: InputUserDto) {
    return this.usersService.createUser(inputUserDto);
  }
  @Get()
  //getUsers(@Query('term') term: string ) - или так getUsers(@Query() query: Type )
  async findAllUsers(@Query() paginationInputDTO: PaginationUserInputDTO) {
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
