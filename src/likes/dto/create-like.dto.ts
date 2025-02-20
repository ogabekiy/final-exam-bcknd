import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateLikeDto {
    @IsNumber()
    @IsNotEmpty()
    product_id:number

    @IsNumber()
    @IsOptional()
    user_id:number
}
