import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './category.model';
import { UsersModule } from 'src/users/users.module';
import { Product } from 'src/products/product.model';

@Module({
  imports:[SequelizeModule.forFeature([Category,Product]),UsersModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
