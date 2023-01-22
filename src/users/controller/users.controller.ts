import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { BanUserDto } from '../dto/ban-user.dto';

@Controller('/sa')
export class UsersController {
  constructor(
    public usersService: UsersService,
    public queryUserRepository: UsersQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post('users')
  async createUser(@Body() inputUserDto: InputUserDto) {
    return this.usersService.createUser(inputUserDto);
  }

  @Get('users')
  async findAllUsers(@Query() paginationInputDTO: PaginationUserInputDTO) {
    return this.queryUserRepository.findAllUsers(paginationInputDTO);
  }

  @Get('users/:id')
  async findUserById(@Param('id') id: string) {
    const findUserById = await this.queryUserRepository.findUserById(id);
    if (!findUserById) throw new NotFoundException([]);
    return findUserById;
  }

  @UseGuards(BasicAuthGuard)
  @Delete('users/:id')
  @HttpCode(204)
  async deleteUserById(@Param('id') id: string) {
    const findUserById = await this.queryUserRepository.findUserById(id);
    if (!findUserById) throw new NotFoundException([]);
    return this.usersService.deleteUserById(id);
  }

  @UseGuards(BasicAuthGuard)
  @Put('users/:id/ban')
  @HttpCode(204)
  async banUserById(@Param('id') id: string, @Body() banUserDto: BanUserDto) {
    return this.usersService.banUserById(id, banUserDto);
  }

  @UseGuards(BasicAuthGuard)
  @Get('blogs')
  @HttpCode(200)
  async findBlogsWithOwnerId(@Query() paginationDto: PaginationInputDTO) {
    console.log(paginationDto);
    return this.usersService.findBlogsWithOwnerId(paginationDto);
  }
}
