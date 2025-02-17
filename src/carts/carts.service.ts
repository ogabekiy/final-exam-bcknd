import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './cart.model';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart) private CartModel: typeof Cart){}

  async create(createCartDto: CreateCartDto) {
    return await this.CartModel.create(createCartDto);
  }

  async findAll() {
    return await this.CartModel.findAll();
  }

  async findOne(id: number) {
    return await this.CartModel.findOne({where: {id}});
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async remove(id: number) {
    return await this.CartModel.destroy({where: {id}});
  }
}
