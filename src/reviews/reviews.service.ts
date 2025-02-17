import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './review.model';
import { User } from 'src/users/user.model';
import { Product } from 'src/products/product.model';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review) private ReviewModel: typeof Review){}

  async create(createReviewDto: CreateReviewDto) {
    const data = await this.ReviewModel.findOne({where: {user_id: createReviewDto.user_id,product_id: createReviewDto.product_id}})
    if(data){
      throw new NotFoundException('yu can give rate 2 times')
    }
    return await this.ReviewModel.create(createReviewDto);
  }

  async findAll() {
    const reviews = await this.ReviewModel.findAll({  
      include: [  
          {  
              model: User,  
              attributes: ['firstname', 'id']  
          },  
          {  
              model: Product,  
              attributes: ['id', 'title']  
          }  
      ]  
  });  
  return reviews;  
  }

  async findOne(id: number) {
    return await this.ReviewModel.findOne({where:{id},include: [  
      {  
          model: User,  
          attributes: ['firstname', 'id']  
      },  
      {  
          model: Product,  
          attributes: ['id', 'title']  
      }  
  ]  }) ;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    return await this.ReviewModel.update(updateReviewDto,{where: {id}});
  }

  async remove(id: number) {
    return await this.ReviewModel.destroy({where:{id}})
  }
}
