import { Transform } from "class-transformer";
import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstname: string

    @IsString()
    @IsOptional()
    surname: string

    @IsEmail()
    @IsNotEmpty()
    email :string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsString()
    @IsNotEmpty()
    @IsIn(['user', 'seller', 'admin'])
    @IsOptional()
    role?: string = 'user';

    @IsString()
    @IsNotEmpty()
    @Length(9, 9)
    @Matches(/^\d+$/, { message: 'Phone number must contain only digits' }) 
    phone: string;

    @IsOptional()
    @IsString()
    profile_image_url?: string;

    @IsOptional()
    @IsString()
    @IsIn(['male', 'female'])
    gender?: string;

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
    @IsNumber()
    @Min(1)
    @Max(150)
    age?: number;

}
