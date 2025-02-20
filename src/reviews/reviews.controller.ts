import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RoleGuard } from 'src/common/guards/roleGuard';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(RoleGuard)
  @Roles('user')
  @Post()
  create(@Body() createReviewDto: CreateReviewDto,@Request() req:any) {
    const authId = req.user.dataValues.id
    createReviewDto.user_id = authId
    return this.reviewsService.create(createReviewDto);
  }


  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @UseGuards(RoleGuard)
  @Roles('admin','user')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto,@Request() req:any) {
    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id

    const data = await this.reviewsService.findOne(+id)
    
    if(authRole !== 'admin' && data.user_id !== +authId){
      throw new ForbiddenException('nice try diddy')
  }

    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(RoleGuard)
  @Roles('admin','user')
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req:any) {

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id

    const data = await this.reviewsService.findOne(+id)
    
    if(authRole !== 'admin' && data.user_id !== +authId){
      throw new ForbiddenException('nice try diddy')
  }

    return await this.reviewsService.remove(+id);
  }
}
