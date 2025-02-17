import { validate } from "class-validator";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "src/products/product.model";
import { User } from "src/users/user.model";

@Table({tableName: 'reviews'})
export class Review extends Model<Review>{
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    user_id: number

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    product_id: number

    @Column({
        type: DataType.FLOAT,
        allowNull:false,
        validate: {
            min: 0,
            max: 5,
            isFloat: true,
        }
    })
    rating: number

    @Column({
        type: DataType.TEXT,
        allowNull:true
    })
    comment: string


    @BelongsTo(() => User)
    user: User

    @BelongsTo(() => Product)
    product: Product
}