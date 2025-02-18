import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    order_id: number

    @IsNumber()
    @IsNotEmpty()
    amount: number

}
