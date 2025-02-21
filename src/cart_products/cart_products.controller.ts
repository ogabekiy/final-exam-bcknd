import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { CartProductsService } from './cart_products.service';
import { CreateCartProductDto } from './dto/create-cart_product.dto';
import { UpdateCartProductDto } from './dto/update-cart_product.dto';
import { RoleGuard } from 'src/common/guards/roleGuard';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('cart-products')
export class CartProductsController {
  constructor(private readonly cartProductsService: CartProductsService) {}

  @UseGuards(RoleGuard)
  @Roles('user')
  @Post()
  create(@Body() createCartProductDto: CreateCartProductDto,@Request() req:any) {

    const authId = req.user.dataValues.id
    createCartProductDto.user_id = authId

    return this.cartProductsService.create(createCartProductDto);
  }

  @UseGuards(RoleGuard)
  @Roles('admin','user')
  @Get()
  findAll(@Request() req:any) {

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id
    // console.log(authRole);
    // console.log(authId);
    if(authRole !== 'admin'){
      return this.cartProductsService.findAllOfUser(+authId);
    }
    return this.cartProductsService.findAll();
  }

  @UseGuards(RoleGuard)
  @Roles('user','admin')
  @Get(':id')
  async findOne(@Param('id') id: string,@Request() req:any) {

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id
    // console.log(authRole);
    // console.log(authId);

    const data = await this.cartProductsService.findOne(+id)

    if(authRole !== 'admin' &&  data.user_id !== authId){
      throw new ForbiddenException('nice try diddy')
    }

    return this.cartProductsService.findOne(+id);
  }

  @UseGuards(RoleGuard)
  @Roles('user')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartProductDto: UpdateCartProductDto,@Request() req:any) {

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id
    // console.log(authRole);
    // console.log(authId);

    const data = await this.cartProductsService.findOne(+id)

    if(data.user_id !== authId){
      throw new ForbiddenException('nice try diddy')
    }

    return this.cartProductsService.update(+id, updateCartProductDto);
  }

  @UseGuards(RoleGuard)
  @Roles('user','admin')
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req:any) {

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id
    // console.log(authRole);
    // console.log(authId);

    const data = await this.cartProductsService.findOne(+id)

    if(authRole !== 'admin' &&  data.user_id !== authId){
      throw new ForbiddenException('nice try diddy')
    }

    return this.cartProductsService.remove(+id);
  }

  @UseGuards(RoleGuard)
  @Roles('user')
  @Patch('decrease/:id')
   async decreaseQuantity(@Request() req:any,@Param('id') productId: string){
    const authId = req.user.dataValues.id
    return await this.cartProductsService.decreaseQuantity(+productId,+authId)
   }
}
