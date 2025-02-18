import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.model';
import { Cart } from 'src/carts/cart.model';

@Module({
  imports:[SequelizeModule.forFeature([Order,Cart])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
