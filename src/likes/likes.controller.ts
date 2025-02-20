import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { RoleGuard } from 'src/common/guards/roleGuard';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(RoleGuard)
  @Roles('user')
  @Post()
  async create(@Body() createLikeDto: CreateLikeDto,@Req() req: any) {
    const userId = await req.user.dataValues.id
    createLikeDto.user_id = userId
    return await this.likesService.create(createLikeDto);
  }


  @UseGuards(RoleGuard)
  @Roles('admin','user')
  @Get()
  async findAll(@Req() req: any) {
    const authId = await req.user.dataValues.id
    const authRole = await req.user.dataValues.role

    if(authRole !== 'admin'){
      return await this.likesService.findAllOfUser(+authId)
    }

    return await this.likesService.findAll();
  }



}
