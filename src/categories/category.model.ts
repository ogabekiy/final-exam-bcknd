import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Product } from "src/products/product.model";

@Table({tableName: 'categories'})
export class Category extends Model<Category>{
    @Column({
        type: DataType.STRING,
        allowNull:false,
        unique: true
    })
    title: string

    @Column({
        type: DataType.STRING,
        allowNull:true
    })
    description: string

    @HasMany(() => Product)
    products: Product[]
}