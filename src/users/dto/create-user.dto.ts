import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstname: string

    @IsString()
    @IsNotEmpty()
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
    role?: string;

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
    @IsNumber()
    @Min(1)  
    @Max(150) 
    age?: number;

}
