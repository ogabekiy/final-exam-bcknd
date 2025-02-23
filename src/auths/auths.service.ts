import { User } from './../users/user.model';
import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { ConfigService } from 'src/common/config/config.service';

@Injectable()
export class AuthsService {
  constructor(@InjectModel(User) private UserModel: typeof User,
  @Inject() private configService:ConfigService
  ){}

  async create(createUserDto: CreateUserDto) {

     const dataE = await this.UserModel.findOne({where:{email:createUserDto.email}})
        const dataP = await this.UserModel.findOne({where:{phone:createUserDto.phone}})
        if(dataE){
          throw new ForbiddenException('email is used before')
        } else if(dataP){
          throw new ForbiddenException('phone is used before')
        }
    
        if (createUserDto.password.length < 5) {
          console.log('xa');
          
          throw new ForbiddenException('Password must be at least 5 characters long');
        }
    
        createUserDto.password = await bcrypt.hash(createUserDto.password,10)

        const user = await this.UserModel.create(createUserDto);
        console.log(user);
        

        return user


  }

  async login(loginAuthDto: LoginAuthDto){
    // console.log(loginAuthDto);
    const data = await this.UserModel.findOne({where:{email:loginAuthDto.email}})

    if(!data){
      throw new BadRequestException("password or email wrong")
    }

    const checkPassword = await bcrypt.compare(loginAuthDto.password,data.password)
    if(!checkPassword){
      throw new UnauthorizedException("valid email or password")
    }

    const token = await jwt.sign({email: loginAuthDto.email},this.configService.get('JWT_ACCESS_TOKEN'),{expiresIn: '1h'})

    return {data,token}
      // return await 'login'
  }
  
}
