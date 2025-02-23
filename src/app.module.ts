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
import { PaymentsModule } from './payments/payments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LikesModule } from './likes/likes.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    SharedModule,
    AuthsModule,
    CategoriesModule,
    ProductsModule,
    ReviewsModule,
    CartsModule,
    CartProductsModule,
    OrdersModule,
    PaymentsModule,
    LikesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
