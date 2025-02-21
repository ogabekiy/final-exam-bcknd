import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCartProductDto {
    @IsNumber()
    @IsOptional()
    user_id: number

    @Transform(({ value }) => Number(value)) // String bo'lsa, numberga aylantiradi
    @IsNumber()
    @IsNotEmpty()
    product_id: number;

    @IsNumber()
    @IsOptional()
    cart_id: number

    @IsNumber()
    @IsOptional()
    quantity?: number = 1;


}
