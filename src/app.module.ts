import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { SharedModule } from './common/shared.module';
import { AuthsModule } from './auths/auths.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CartsModule } from './carts/carts.module';
import { CartProductsModule } from './cart_products/cart_products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      logging: console.log,
      dialect:  'postgres', 
      database: 'e_commerce',
      username: 'postgres',
      password: '123456',
      host: process.env.DB_HOST,
      port: 5432, 
      autoLoadModels: true, 
      synchronize: true,
    }),
    UsersModule,
    SharedModule,
    AuthsModule,
    CategoriesModule,
    ProductsModule,
    ReviewsModule,
    CartsModule,
    CartProductsModule,
    OrdersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
