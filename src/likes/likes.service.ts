import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './like.model';
import { Product } from 'src/products/product.model';
import { User } from 'src/users/user.model';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like) private likeModel:typeof Like){}

  async create(createLikeDto: CreateLikeDto) {
    const existingLike = await this.likeModel.findOne({
        where: { 
            product_id: createLikeDto.product_id, 
            user_id: createLikeDto.user_id 
        }
    });

    if (existingLike) {
        await existingLike.destroy();
        return { message: "Unliked successfully" };
    }

    return await this.likeModel.create(createLikeDto);
    }
    
  async findAll() {
    return await this.likeModel.findAll({include: [{model: Product},{model: User}]});
  }

  async findAllOfUser(userid: number) {
    return await this.likeModel.findAll({where:{user_id: userid}})
  }

  
}
