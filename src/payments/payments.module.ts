import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './payment.model';
import { Order } from 'src/orders/order.model';

@Module({
  imports: [SequelizeModule.forFeature([Payment,Order])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
