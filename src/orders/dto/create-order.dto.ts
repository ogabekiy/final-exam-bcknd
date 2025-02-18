import {  IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNumber()
    @IsOptional()
    user_id: number

    @IsNumber()
    @IsNotEmpty()
    cart_id: number

    @IsNumber()
    @IsOptional()
    total_price: number

    @IsString()
    @IsOptional()
    status: string

    @IsString()
    @IsNotEmpty()
    payment_method: string
}
