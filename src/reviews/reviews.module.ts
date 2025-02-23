import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './review.model';
import { UsersModule } from 'src/users/users.module';
import { Product } from 'src/products/product.model';

@Module({
  imports: [SequelizeModule.forFeature([Review,Product]),UsersModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
