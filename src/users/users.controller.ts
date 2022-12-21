import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/creaet-user.dto';

@Controller('users')
export class UsersController {
  constructor(public usersService: UsersService) {}
  @Get()
  //getUsers(@Query('term') term: string ) - или так getUsers(@Query() query: Type )
  getUsers(@Query() query: { term: string }) {
    // return [
    //   { id: 1, name: 'Artur' },
    //   { id: 2, name: 'Andrey' },
    // ].filter((e) => e.name.indexOf(query.term) > -1);
    return query;
  }
  @Post()
  async createUser(@Body() userInputModel: CreateUserDto) {
    const newCreatedUser = await this.usersService.createUser(userInputModel);
    return {
      id: newCreatedUser.id,
      title: newCreatedUser.title,
      description: newCreatedUser.description,
    };
  }
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return [{ id: 1 }, { id: 2 }].find((e) => {
      e.id === +id;
    });
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() inputModel: CreateUserDto) {
    return {
      id: inputModel.id,
      title: inputModel.title,
    };
  }
}
