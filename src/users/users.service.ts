import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private UserModel: typeof User){}

  async create(createUserDto: CreateUserDto) {

    const dataE = await this.UserModel.findOne({where:{email:createUserDto.email}})
    const dataP = await this.UserModel.findOne({where:{phone:createUserDto.phone}})
    if(dataE){
      throw new ForbiddenException('email is used before')
    } else if(dataP){
      throw new ForbiddenException('phone is used before')
    }

    if (createUserDto.password.length < 5) {
      throw new Error('Password must be at least 5 characters long');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password,10)
    
    return await this.UserModel.create(createUserDto);
  }

  async findOneByEmail(email: string){
    return await this.UserModel.findOne({where:{email}})
  }

  async findAll() {
    return  await this.UserModel.findAll();
  }

  async findOne(id: number) {
    const data = await this.UserModel.findOne({where:{id:id}})

    if(!data){
      throw new Error('user with this id dont exist')
    }

    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = await this.UserModel.findOne({where:{id:id}})
    if(!data){
      throw new Error('user with this id dont exist')
    }
    return await this.UserModel.update(updateUserDto,{where:{id}}) ;
  }

  async remove(id: number) {
    const data = await this.UserModel.findOne({where:{id:id}})
    if(!data){
      throw new Error('user with this id dont exist')
    }
    return await this.UserModel.destroy({where:{id}});
  }
}
