import { FastifyReply } from 'fastify';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { UpdateUserDto, UserListQuerParams } from './dto/user.dto';

import { UserService } from './user.service';

@Controller('v1')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Post('users')
  create(@Body() CreateUserDto, @Res() reply) {
    return this.usersService.create(CreateUserDto).then((user) => {
      reply.code(HttpStatus.CREATED).send(user);
    });
  }

  @Get('users')
  findAll(@Query() query: UserListQuerParams, @Res() reply: FastifyReply) {
    return this.usersService.findAll(query).then((user) => {
      reply.code(HttpStatus.CREATED).send(user);
    });
  }

  @Put('user/:id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() reply: any,
  ) {
    return this.usersService.update(id, updateUserDto).then((updatedUser) => {
      reply.code(HttpStatus.CREATED).send(updatedUser);
    });
  }

  @Delete('user/:id')
  remove(@Param('id') id: string, @Res() reply: FastifyReply) {
    return this.usersService.remove(+id).then(() => {
      reply
        .code(HttpStatus.OK)
        .send({ message: ['user deleted Successfully'] });
    });
  }
}
