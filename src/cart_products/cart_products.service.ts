import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    console.log(createCartProductDto);
    

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

    if (createCartProductDto.quantity > product.quantity) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + createCartProductDto.quantity;
      if (newQuantity > product.quantity) {
        throw new BadRequestException('Requested quantity exceeds available stock');
      }
      existingProduct.quantity = newQuantity;
      ActiveCart.total_price += product.price * createCartProductDto.quantity;
      await ActiveCart.save(); 
      return await existingProduct.save();
    }

    if (createCartProductDto.quantity <= 0) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const newCartProduct = await this.CartProductsModel.create(createCartProductDto);
    ActiveCart.total_price += product.price * createCartProductDto.quantity;
    await ActiveCart.save(); 

    console.log('kartaga qoshildi');
    

    return newCartProduct;
  }

  async decreaseQuantity(product_id: number, user_id: number) {
    const ActiveCart = await this.CartModel.findOne({
      where: { user_id, status: 'active' },
    });
  
    if (!ActiveCart) {
      throw new NotFoundException('Active cart not found');
    }
  
    const cartProduct = await this.CartProductsModel.findOne({
      where: { cart_id: ActiveCart.id, product_id },
    });
  
    if (!cartProduct) {
      throw new NotFoundException('Product not found in the cart');
    }
  
    if (cartProduct.quantity <= 1) {
      throw new BadRequestException('Cannot decrease quantity below 1');
    }
  
    cartProduct.quantity -= 1;
    ActiveCart.total_price -= (await this.ProductModel.findByPk(product_id)).price;
  
    await cartProduct.save();
    await ActiveCart.save();
  
    return cartProduct;
  }
  



  async findAll() {
    return await this.CartProductsModel.findAll({
      include: { model: Cart },
    });
  }

  async findAllOfUser(UserId: number) {
    return await this.CartProductsModel.findAll({ where: { user_id: UserId }, include: { model: Cart }, });
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

    const product = await this.ProductModel.findByPk(data.product_id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateCartProductDto.quantity > product.quantity) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }

    const ActiveCart = await this.CartModel.findByPk(data.cart_id);
    if (!ActiveCart) {
      throw new NotFoundException('Cart not found');
    }

    if (updateCartProductDto.quantity <= 0) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const oldQuantity = data.quantity;
    await this.CartProductsModel.update(updateCartProductDto, { where: { id } });
    const updatedProduct = await this.CartProductsModel.findOne({ where: { id } });

    ActiveCart.total_price += product.price * (updatedProduct.quantity - oldQuantity);
    await ActiveCart.save(); 

    return updatedProduct;
  }

  async remove(id: number) {
    const data = await this.findOne(id);
    if (!data) {
      throw new NotFoundException('Cart product not found');
    }

    const ActiveCart = await this.CartModel.findByPk(data.cart_id);
    const product = await this.ProductModel.findByPk(data.product_id);

    if (product && ActiveCart) {
      ActiveCart.total_price -= product.price * data.quantity;
      await ActiveCart.save();
      await this.CartProductsModel.destroy({ where: { id } });
    }

    return data;
  }
}
