import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './cart.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports : [SequelizeModule.forFeature([Cart]),UsersModule],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
