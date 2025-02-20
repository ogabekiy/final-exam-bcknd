import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "src/products/product.model";
import { User } from "src/users/user.model";

@Table({tableName: 'likes'})

export class Like extends Model<Like>{
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    product_id: number

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    user_id: number

    @BelongsTo(() => Product)
    product: Product

    @BelongsTo(() => User)
    user: User

}