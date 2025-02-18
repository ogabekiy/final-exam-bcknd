import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Cart } from "src/carts/cart.model";
import { Product } from "src/products/product.model";
import { User } from "src/users/user.model";

@Table({tableName: 'cart_products'})
export class CartProducts extends Model<CartProducts> {
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    product_id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id: number;

    @ForeignKey(() => Cart)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    cart_id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity: number;

    @BelongsTo(() => Product)
    product: Product;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Cart)
    cart: Cart;  
}
