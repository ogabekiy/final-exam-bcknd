import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RoleGuard } from 'src/common/guards/roleGuard';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}


  @UseGuards(RoleGuard)
  @Roles('user')
  @Post()
  create(@Body() createOrderDto: CreateOrderDto,@Request() req:any) {

    const authId = req.user.dataValues.id
    createOrderDto.user_id = authId

    return this.ordersService.create(createOrderDto);
  }


  @UseGuards(RoleGuard)
  @Roles("user","admin")
  @Get()
  findAll(@Request() req:any) {

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id
  
    if(authRole !== 'admin'){
      return this.ordersService.findAllOfUser(+authId);
    }
    return this.ordersService.findAll();
  }

  @UseGuards(RoleGuard)
  @Roles('admin','user')
  @Get(':id')
  async findOne(@Param('id') id: string,@Request() req:any) {

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id

    const data = await this.ordersService.findOne(+id)

    if(authRole !== 'admin' && authId !== +data.user_id){
        throw new ForbiddenException('nice try diddy')
    }

    return this.ordersService.findOne(+id);
  }

  @UseGuards(RoleGuard)
  @Roles('user')
  @Get('accept/:id')
  async acceptOne(@Param('id')id:string,@Request() req:any){

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id

    const data = await this.ordersService.findOne(+id)

    if(authId !== +data.user_id){
        throw new ForbiddenException('nice try diddy')
    }

    return this.ordersService.acceptOrder(+id)
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @UseGuards(RoleGuard)
  @Roles('user')
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req:any) {

    const authId = req.user.dataValues.id

    const data = await this.ordersService.findOne(+id)

    if(authId !== +data.user_id){
        throw new ForbiddenException('nice try diddy')
    }

    return this.ordersService.cancelOrder(+id);
  }
}
