import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCartDto {
    @IsNumber()
    @IsNotEmpty()
    user_id: number

    @IsOptional()
    @IsNotEmpty()
    status:string
}
