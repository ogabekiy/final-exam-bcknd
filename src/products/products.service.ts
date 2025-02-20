import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { User } from 'src/users/user.model';
import { Category } from 'src/categories/category.model';
import { Review } from 'src/reviews/review.model';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product) private ProductModel: typeof Product,
  @InjectModel(Category) private categoryModel: typeof Category
  ){}

  async create(createProductDto: CreateProductDto) {    
    const categoryId = createProductDto.category_id
    const data = await this.categoryModel.findOne({where: {id:categoryId}})
    if(!data){
      throw new NotFoundException('category not found')
    }
    return await this.ProductModel.create(createProductDto);
  }

  async findAll() {
    const products = await this.ProductModel.findAll({where: {approved:true},
      include: [{ model: User }, { model: Category }, { model: Review }]
    });
  
    products.forEach((product) => {
      if (product.reviews && product.reviews.length > 0) {
        const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        product.dataValues.totalrating = totalRating;
      } else {
        product.dataValues.totalrating = 0; 
      }
    });
  
    return products;
  }
  
  async findOne(id: number) {
    const data = await this.ProductModel.findOne({
      where: { id },
      include: [{ model: User }, { model: Category }, { model: Review }]
    });
  
    if (!data) {
      throw new NotFoundException('Product not found');
    }
  
    if (data.reviews && data.reviews.length > 0) {
      const totalRating = data.reviews.reduce((acc, review) => acc + review.rating, 0);
      data.dataValues.totalrating = totalRating;
    } else {
      data.dataValues.totalrating = 0; 
    }
  
    console.log(data.dataValues.totalrating); 
  
    return data;
  }

  async approveProduct(id:number){
      const data = await this.ProductModel.findOne({where: {id:id}})
      if(!data){
        throw new NotFoundException('product not found')
      }

      data.approved = true
      await data.save()
      return 'done'
  }

  async findAllNotApproved() {
    const products = await this.ProductModel.findAll({
      where: {approved: false
      },
    });
    
    return products;
  }

  async findAllNotApprovedOfSeller(id:number) {
    const products = await this.ProductModel.findAll({where: {approved: false,seller_id:id },});
    return products;
  }


  async searchForProduct(query: string) {
    return await this.ProductModel.findAll({
        where: {
            [Op.or]: [
                { title: { [Op.iLike]: `%${query}%` } },
                { description: { [Op.iLike]: `%${query}%` } }
            ],approved: true
        }
    });
}
  
  

  async update(id: number, updateProductDto: UpdateProductDto) {
    const data = await this.ProductModel.findOne({where:{id}})
    if(!data){
      throw new NotFoundException('product not found')
    }

    console.log(updateProductDto);  

    const u = await this.ProductModel.update(updateProductDto,{where: {id}})
    
    return u;
  } 




  async remove(id: number) {
    const data = await this.ProductModel.findOne({where:{id}})
    if(!data){
      throw new NotFoundException('product not found')
  }
    
    return await this.ProductModel.destroy({where:{id}});
  }

  async removeImage(imgUrl: string ,productId: string){
      const data = await this.ProductModel.findOne({where:{id:productId}})

      if (!data) {
        throw new NotFoundException('Product not found');
      }

      let valueToRemove = imgUrl;

      let index = data.images.indexOf(valueToRemove);

      console.log(index);
      console.log(data.images);
      
      data.images.splice(index, 1); 
      console.log(data.images);
      
      return await this.ProductModel.update({images:data.images},{where :{id: productId}})
  }
}
