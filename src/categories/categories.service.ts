import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import { Product } from 'src/products/product.model';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private CategoryModel: typeof Category){}

  async create(createCategoryDto: CreateCategoryDto) {
    const data = await this.CategoryModel.findOne({where:{title: createCategoryDto.title}}) 
    if(data){
      throw new ForbiddenException('this category already exists')
    }
    return await this.CategoryModel.create(createCategoryDto);
  }

  async findAll() {
    return await this.CategoryModel.findAll({include: [{model: Product}]});
  }

  async findOne(id: number) {
    const data = await this.CategoryModel.findOne({where:{id},include: [{model: Product}]})
    if(!data){
      throw new NotFoundException('category not found')
    }

    return data;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const data = await this.findOne(id)
    if(!data){
      throw new NotFoundException('category not found')
    }
    return await this.CategoryModel.update(updateCategoryDto,{where:{id}})
  }

  async remove(id: number) {
    const data = await this.findOne(id)
    if(!data){
      throw new NotFoundException('category not found')
    }

    return await this.CategoryModel.destroy({where: {id}});
  }

}
