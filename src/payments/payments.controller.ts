import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from 'src/common/guards/authGuard';
import { RoleGuard } from 'src/common/guards/roleGuard';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentsService.create(createPaymentDto);
  }


  @UseGuards(RoleGuard)
  @Roles('admin','user')
  @Get()
  async findAll(@Request() req:any) {

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id

    if(authRole !== 'admin'){
      return await this.paymentsService.findAllOfUser(+authId)
    }

    return await this.paymentsService.findAll();
  }
}
