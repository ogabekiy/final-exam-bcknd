import { Controller, Post, Body, UploadedFiles, UseInterceptors, Get, Param, Patch, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateProductDto } from './dto/update-product.dto';
import { RemoveImg } from './dto/remove-img.dto';
import { RoleGuard } from 'src/common/guards/roleGuard';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 20, {
    dest: './uploads', 
  }))
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Express.Multer.File[]) {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const productTitle = createProductDto.title.replace(/\s+/g, '');

    const imageLinks = files.map((file, index) => {
      const randomSuffix = Math.random().toString(36).substring(2, 10); 
      const newFileName = `${productTitle}-${randomSuffix}-${index + 1}${path.extname(file.originalname)}`
      const newFilePath = path.join(uploadsDir, newFileName);
      
      fs.renameSync(file.path, newFilePath);
      
      return path.join('uploads', newFileName);
    });

    createProductDto.images = imageLinks;

    const product = await this.productsService.create(createProductDto);

    return product;
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateProductDto) {
    return this.productsService.update(+id, updateCategoryDto);
  }

  @Patch('deleteImage/:id')
  deleteImg(@Param('id') id: string, @Body() body: RemoveImg) {
  return this.productsService.removeImage(body.imgUrl, id);
  }
  


  @Patch('addImage/:id')
  @UseInterceptors(FilesInterceptor('images', 20, {
  dest: './uploads',
}))
async addImage(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const existingProduct = await this.productsService.findOne(+id);
  if (!existingProduct) {
    throw new NotFoundException('Product not found');
  }

  const productTitle = existingProduct.title.replace(/\s+/g, '');

  const imageLinks = files.map((file, index) => {
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const newFileName = `${productTitle}-${randomSuffix}-${index + 1}${path.extname(file.originalname)}`;
    const newFilePath = path.join(uploadsDir, newFileName);

    fs.renameSync(file.path, newFilePath);

    return path.join('uploads', newFileName);
  });

  const newImages = [...(existingProduct.images || []), ...imageLinks];

  const updatedProduct = await this.productsService.update(+id, { images: newImages });

  return updatedProduct;
}

  @UseGuards(RoleGuard)
  @Roles('admin')
  @Get('approve/:id') 
  approve(@Param('id') id:string){
    return this.productsService.approveProduct(+id)
  }

  @Get('all-notApproved')
    notApproved(){
  return this.productsService.findAllNotApproved();
}





  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

}

