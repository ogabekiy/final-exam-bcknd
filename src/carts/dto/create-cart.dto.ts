import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCartDto {
    @IsNumber()
    @IsOptional()
    user_id: number

    @IsOptional()
    status:string

    @IsNumber()
    @IsOptional()
    total_price: number
}
