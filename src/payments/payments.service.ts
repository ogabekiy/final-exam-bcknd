import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './payment.model';
import { Order } from 'src/orders/order.model';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment) private PaymentModel: typeof Payment,
  @InjectModel(Order) private OrderModel: typeof Order
  ){}
  async create(createPaymentDto: CreatePaymentDto) {

    const orderData = await this.OrderModel.findOne({ where: { id: createPaymentDto.order_id } });

    if (!orderData) {
      throw new NotFoundException('Order not found');
    }


    const totalPrice = orderData.total_price;

    if(totalPrice > createPaymentDto.amount){
      throw new ForbiddenException('yetarli pul tashlang')
    }
    
    orderData.status = 'processin'
    await orderData.save()

    const paymentData = await this.PaymentModel.findOne({where:{order_id:createPaymentDto.order_id}})

    return 'sizning buyurtmangiz prosecda'

  }

  async findAll() {
    return await this.PaymentModel.findAll();
  }

  async findAllOfUser(userId: number) {
    const orders = await this.OrderModel.findAll({
        where: { user_id: userId }
    });

    if (orders.length === 0) {
        return [];
    }
    const orderIds = orders.map(order => order.id);

    const payments = await this.PaymentModel.findAll({
        where: { order_id: orderIds }  
    });

    return payments;
}

}
