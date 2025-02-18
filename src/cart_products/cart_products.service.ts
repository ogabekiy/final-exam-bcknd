import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartProductDto } from './dto/create-cart_product.dto';
import { UpdateCartProductDto } from './dto/update-cart_product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { CartProducts } from './cart_product.model';
import { Cart } from 'src/carts/cart.model';

@Injectable()
export class CartProductsService {
  constructor(@InjectModel(CartProducts) private CartProductsModel: typeof CartProducts,
  @InjectModel(Cart) private CartModel: typeof Cart
  ){}

  async create(createCartProductDto: CreateCartProductDto) {
  
    let ActiveCart = await this.CartModel.findOne({
        where: { user_id: createCartProductDto.user_id, status: 'active' }
    });
    if (!ActiveCart) {
        ActiveCart = await this.CartModel.create({ user_id: createCartProductDto.user_id, status: 'active' });
    }

    createCartProductDto.cart_id = ActiveCart.id;

    const data = await this.CartProductsModel.findOne({where:{cart_id:createCartProductDto.cart_id,product_id:createCartProductDto.product_id}})
    if(data){
      data.quantity += 1
      return await data.save();
    }

    return await this.CartProductsModel.create(createCartProductDto);
}

  async findAll() {
    return await this.CartProductsModel.findAll({include: {model: Cart}});
  }

  async findOne(id: number) {
    const data = await this.CartProductsModel.findOne({where: {id},include:[{model:Cart}]})
    if(!data){
      throw new NotFoundException('not found')
    }
    return data;
  }

  async update(id: number, updateCartProductDto: UpdateCartProductDto) {
    const data = await this.findOne(id)
    if(!data){
      throw new NotFoundException('not found')
    }
    return await this.CartProductsModel.update(updateCartProductDto,{where:{id}});
  }

  async remove(id: number) {
    const data = await this.findOne(id)
    if(!data){
      throw new NotFoundException('not found')
    }
    return await this.CartProductsModel.destroy({where:{id}});
  }
}
