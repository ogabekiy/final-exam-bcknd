import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/common/guards/roleGuard';
import { Roles } from 'src/common/guards/roles.decorator';
import { AuthGuard } from 'src/common/guards/authGuard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    if(createUserDto.role == 'admin'){
      throw new ForbiddenException('gud try diddy')
    }
    return this.usersService.create(createUserDto);
  }

  @UseGuards(RoleGuard)
  @Roles('admin')
  @Post('addAdmin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    
    return this.usersService.createAdmin(createUserDto);
  }

  @UseGuards(RoleGuard)
  @Roles('admin')
  @Get()
  findAll(@Request() req:any) {
    const authUserId = req.user.dataValues.id
    console.log(authUserId);
    
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Request() req:any) {
    const authRole = req.user.dataValues.role

    const authId = req.user.dataValues.id
    // console.log(authRole);
    console.log(authId);
    console.log(id);
    
    

    if(authRole !== 'admin' && authId !== +id){
        throw new ForbiddenException('nice try diddy')
    }
    
    return this.usersService.findOne(+id);
  }


  @UseGuards(RoleGuard)
  @Roles('admin')
  @Get('/role/:role')
  async getAllUsersWithRole(@Param('role') role: string ){
        return await this.usersService.findUsersWithRole(role)
  }



  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Request() req:any) {
    const authRole = req.user.dataValues.role

    const authId = req.user.dataValues.id
    // console.log(authRole);
    console.log(authId);
    console.log(id);
    
    

    if(authRole !== 'admin' && authId !== +id){
        throw new ForbiddenException('nice try diddy')
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string,@Request() req:any) {
    const authRole = req.user.dataValues.role

    const authId = req.user.dataValues.id
    // console.log(authRole);
    console.log(authId);
    console.log(id);
    
    

    if(authRole !== 'admin' && authId !== +id){
        throw new ForbiddenException('nice try diddy')
    }

    return this.usersService.remove(+id);
  }
}
