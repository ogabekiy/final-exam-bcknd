import { IsNotEmpty, IsString, IsInt, IsNumber, IsPositive, IsArray, Min, ArrayMinSize, IsOptional, IsUrl, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  seller_id: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  category_id: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  approved?: boolean = false


  @IsInt()
  @IsPositive()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

//   @IsArray()
//   @IsString({ each: true })
//   @ArrayMinSize(1)
//   @IsUrl({}, { each: true })
  @IsOptional()
  images: string[];
}