import { Module } from '@nestjs/common';
import { CartProductsService } from './cart_products.service';
import { CartProductsController } from './cart_products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartProducts } from './cart_product.model';
import { Cart } from 'src/carts/cart.model';

@Module({
  imports: [SequelizeModule.forFeature([CartProducts,Cart])],
  controllers: [CartProductsController],
  providers: [CartProductsService],
})
export class CartProductsModule {}
