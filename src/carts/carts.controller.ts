import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RoleGuard } from 'src/common/guards/roleGuard';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @UseGuards(RoleGuard)
  @Roles('user')
  @Post()
  create(@Body() createCartDto: CreateCartDto,@Request() req:any) {

    const authId = req.user.dataValues.id
    createCartDto.user_id = authId

    return this.cartsService.create(createCartDto);
  }

  // cmon ngga 

  
  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(+id);
  }


  @UseGuards(RoleGuard)
  @Roles('user')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto,@Request() req:any) {

    
  const authId = req.user.dataValues.id
  const data = await this.cartsService.findOne(+id)
  
  if(authId !== +data.user_id){
      throw new ForbiddenException('nice try diddy')
  }

    return this.cartsService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}
