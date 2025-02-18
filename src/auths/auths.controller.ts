import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { LoginAuthDto } from './dto/login-auth';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    if(createAuthDto.role == 'admin'){
      throw new ForbiddenException('gud try diddy')
    }
    return this.authsService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authsService.login(loginAuthDto);
  }

}
