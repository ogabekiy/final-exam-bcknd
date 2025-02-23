import { Controller, Post, Body, UploadedFiles, UseInterceptors, Get, Param, Patch, Delete, NotFoundException, UseGuards, Request, ForbiddenException } from '@nestjs/common';
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

  @UseGuards(RoleGuard)
  @Roles('seller')
  @Post()
  @UseInterceptors(FilesInterceptor('images', 20, {
    dest: './uploads', 
  }))
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Express.Multer.File[],@Request() req:any) {

    const authId = req.user.dataValues.id

    createProductDto.seller_id = authId

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

  @UseGuards(RoleGuard)
  @Roles('seller')
  @Get('/ofSeller')
  findAllOfSeller(@Request() req:any) {
    const authId = req.user.dataValues.id
    return this.productsService.findAllOfSeller(+authId);
  }

  @Get('search/:query')
  async searchForProoduct(@Param('query') query: string){
    return await this.productsService.searchForProduct(query)
  }
  
  @UseGuards(RoleGuard)
  @Roles('admin','seller')
  @Get('all-notApproved')
  notApproved(@Request() req:any){

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id
    // console.log(authRole);       

    if(authRole == 'seller'){
        return this.productsService.findAllNotApprovedOfSeller(+authId)
    }
    // findAllNotApprovedOfSeller

      return this.productsService.findAllNotApproved();
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {

    return this.productsService.findOne(+id);
  }

  @UseGuards(RoleGuard)
  @Roles('admin','seller')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateProductDto,@Request() req:any) {
    
    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id

    const data = await this.productsService.findOne(+id)
    
    if(authRole !== 'admin' && authId !== +data.seller_id){
      throw new ForbiddenException('nice try diddy')
    }


    return this.productsService.update(+id, updateCategoryDto);
  }

  @UseGuards(RoleGuard)
  @Roles('admin','seller')
  @Patch('deleteImage/:id')
  async deleteImg(@Param('id') id: string, @Body() body: RemoveImg,@Request() req:any) {
     
    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id

    const data = await this.productsService.findOne(+id)
    
    if(authRole !== 'admin' && authId !== +data.seller_id){
      throw new ForbiddenException('nice try diddy')
    }

  return this.productsService.removeImage(body.imgUrl, id);
  }
  

  @UseGuards(RoleGuard)
  @Roles('seller')
  @Patch('addImage/:id')
  @UseInterceptors(FilesInterceptor('images', 20, {
  dest: './uploads',
}))
async addImage(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[],@Request() req:any) {

  console.log(id);
  

  const authRole = req.user.dataValues.role
  const authId = req.user.dataValues.id

  const data = await this.productsService.findOne(+id)
  
  if(authRole !== 'admin' && authId !== +data.seller_id){
    throw new ForbiddenException('nice try diddy')
  }

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
  console.log(newImages);
  
  const updatedProduct = await this.productsService.update(+id, { images: newImages });
  console.log(updatedProduct);
  
  return updatedProduct;
}

  @UseGuards(RoleGuard)
  @Roles('admin')
  @Get('approve/:id') 
  approve(@Param('id') id:string){
    return this.productsService.approveProduct(+id)
  }


  @UseGuards(RoleGuard)
  @Roles('admin','seller')
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req:any) {

    const authRole = req.user.dataValues.role
    const authId = req.user.dataValues.id

    const data = await this.productsService.findOne(+id)
    
    if(authRole !== 'admin' && authId !== +data.seller_id){
      throw new ForbiddenException('nice try diddy')
    }


    return this.productsService.remove(+id);
  }

}

