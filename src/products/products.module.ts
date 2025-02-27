import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { UsersModule } from 'src/users/users.module';
import { Category } from 'src/categories/category.model';

@Module({
  imports: [SequelizeModule.forFeature([Product,Category]),UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
