import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartProductDto } from './dto/create-cart_product.dto';
import { UpdateCartProductDto } from './dto/update-cart_product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { CartProducts } from './cart_product.model';
import { Cart } from 'src/carts/cart.model';
import { Product } from 'src/products/product.model'; 

@Injectable()
export class CartProductsService {
  constructor(
    @InjectModel(CartProducts) private CartProductsModel: typeof CartProducts,
    @InjectModel(Cart) private CartModel: typeof Cart,
    @InjectModel(Product) private ProductModel: typeof Product 
  ) {}

  async create(createCartProductDto: CreateCartProductDto) {
    let ActiveCart = await this.CartModel.findOne({
      where: { user_id: createCartProductDto.user_id, status: 'active' },
    });

    if (!ActiveCart) {
      ActiveCart = await this.CartModel.create({
        user_id: createCartProductDto.user_id,
        status: 'active',
        total_price: 0, 
      });
    }

    createCartProductDto.cart_id = ActiveCart.id;

    const existingProduct = await this.CartProductsModel.findOne({
      where: {
        cart_id: createCartProductDto.cart_id,
        product_id: createCartProductDto.product_id,
      },
    });

    const product = await this.ProductModel.findByPk(createCartProductDto.product_id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (existingProduct) {
      existingProduct.quantity += 1;

      ActiveCart.total_price += product.price;
      await ActiveCart.save(); 

      return await existingProduct.save();
    }

    const newCartProduct = await this.CartProductsModel.create(createCartProductDto);

    ActiveCart.total_price += product.price * createCartProductDto.quantity;
    await ActiveCart.save(); 

    return newCartProduct;
  }

  async findAll() {
    return await this.CartProductsModel.findAll({
      include: { model: Cart },
    });
  }

  async findAllOfUser(UserId:number) {
    return await this.CartProductsModel.findAll({  where:{user_id:UserId}, include: { model: Cart },});
  }

  async findOne(id: number) {
    const data = await this.CartProductsModel.findOne({
      where: { id },
      include: [{ model: Cart }],
    });
    if (!data) {
      throw new NotFoundException('Cart product not found');
    }
    return data;
  }

  async update(id: number, updateCartProductDto: UpdateCartProductDto) {
    const data = await this.findOne(id);
    if (!data) {
      throw new NotFoundException('Cart product not found');
    }

    await this.CartProductsModel.update(updateCartProductDto, { where: { id } });

    const updatedProduct = await this.CartProductsModel.findOne({ where: { id } });
    const product = await this.ProductModel.findByPk(updatedProduct.product_id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const ActiveCart = await this.CartModel.findByPk(updatedProduct.cart_id);
    ActiveCart.total_price = await this.recalculateTotalPrice(ActiveCart.id);
    await ActiveCart.save(); 

    return data;
  }

  async remove(id: number) {
    const data = await this.findOne(id);
    if (!data) {
      throw new NotFoundException('Cart product not found');
    }

    const ActiveCart = await this.CartModel.findByPk(data.cart_id);
    const product = await this.ProductModel.findByPk(data.product_id);

    if (product && ActiveCart) {
      await this.CartProductsModel.destroy({ where: { id } });

      ActiveCart.total_price -= product.price * data.quantity;
      await ActiveCart.save(); 
    }

    return data;
  }

  private async recalculateTotalPrice(cartId: number): Promise<number> {
    const cartProducts = await this.CartProductsModel.findAll({
      where: { cart_id: cartId },
    });

    let total = 0;
    for (const cartProduct of cartProducts) {
      const product = await this.ProductModel.findByPk(cartProduct.product_id);
      if (product) {
        total += product.price * cartProduct.quantity;
      }
    }
    return total;
  }
}
