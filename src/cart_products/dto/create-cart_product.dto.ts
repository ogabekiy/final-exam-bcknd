import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCartProductDto {
    @IsNumber()
    @IsNotEmpty()
    user_id: number

    @IsNumber()
    @IsNotEmpty()
    product_id: number

    @IsNumber()
    @IsOptional()
    cart_id: number

    @IsNumber()
    @IsNotEmpty()
    quantity: number    


}
