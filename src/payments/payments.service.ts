import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
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

    // Check the total price of the order
    const totalPrice = orderData.total_price;

    // Check if payment is enough or needs more
    if (createPaymentDto.amount < totalPrice) {
      // If payment amount is less than the total price, calculate how much is remaining
      const remainingAmount = totalPrice - createPaymentDto.amount;
      return `You still need to pay ${remainingAmount} more.`;
    }

    // If the payment amount is enough or exceeds the total price
    orderData.status = 'processin';  // Change order status to 'processing'
    await orderData.save();

    // Create a new payment record
    let payment = await this.PaymentModel.findOne({ where: { order_id: createPaymentDto.order_id } });

    if (payment) {
      // If payment already exists for this order, add the new payment amount to the existing one
      payment.amount += createPaymentDto.amount;
      await payment.save();
    } else {
      // If it's a new payment, create a new payment record
      payment = await this.PaymentModel.create({
        order_id: createPaymentDto.order_id,
        amount: createPaymentDto.amount,
      });
    }

    // If the total payment has reached the total price, update the order to 'processing'
    if (payment.amount >= totalPrice) {
      orderData.status = 'processin';
      await orderData.save();
      return 'Payment is complete, order status is now "processing".';
    }

    return `Payment received. You still need to pay ${totalPrice - payment.amount} more.`;
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
