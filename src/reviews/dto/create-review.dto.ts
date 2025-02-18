import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from "class-validator";

export class CreateReviewDto {
    @IsNumber()
    @IsOptional()
    user_id: number;

    @IsNumber()
    @IsNotEmpty()
    product_id: number;

    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    comment: string;
}
