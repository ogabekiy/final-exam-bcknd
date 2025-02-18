import { Module } from '@nestjs/common';
import { CartProductsService } from './cart_products.service';
import { CartProductsController } from './cart_products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartProducts } from './cart_product.model';
import { Cart } from 'src/carts/cart.model';
import { Product } from 'src/products/product.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([CartProducts,Cart,Product]),UsersModule],
  controllers: [CartProductsController],
  providers: [CartProductsService],
})
export class CartProductsModule {}
