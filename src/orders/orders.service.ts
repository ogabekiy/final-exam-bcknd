import { Cart } from 'src/carts/cart.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { CartProducts } from 'src/cart_products/cart_product.model';
import { Product } from 'src/products/product.model';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order) private OrderModel: typeof Order,
  @InjectModel(Cart) private CartModel: typeof Cart
  ){}

  async create(createOrderDto: CreateOrderDto) {
    const dataCart = await this.CartModel.findOne({where:{id:createOrderDto.cart_id}})

    if(dataCart){
      dataCart.status = 'ordered'
      await dataCart.save()
    }

    createOrderDto.total_price = dataCart.total_price

    const data = await this.OrderModel.create(createOrderDto)
    
    return data;
  }

  async findAll() {
    return await this.OrderModel.findAll({include: {model: Cart,include: [{model: CartProducts,include: [{model: Product}]}]}});
  }

  async findOne(id: number) {
    return await this.OrderModel.findOne({where: {id},include: {model: Cart,include: [{model: CartProducts,include: [{model: Product}]}]}});
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async cancelOrder(id: number) {
    
    const data = await this.OrderModel.findOne({where: {id}})
    if (!data) {
      throw new NotFoundException('Order not found');
    }
    data.status = 'cancelled'
    await data.save()
    return `order is cancelled`;
  }

  async acceptOrder(id:number){
    const data = await this.findOne(id)
    if (!data) {
      throw new NotFoundException('Order not found');
    }
    data.status = 'delivered'
    await data.save()
    return 'order is delivered'
  }
}
