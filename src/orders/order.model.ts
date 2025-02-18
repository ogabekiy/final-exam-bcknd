import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Cart } from "src/carts/cart.model";
import { User } from "src/users/user.model";

@Table({tableName: 'orders'})
export class Order extends Model<Order>{
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull :false
    })
    user_id: number

    @ForeignKey(() => Cart)
    @Column({
        type: DataType.INTEGER,
        allowNull:false
    })
    cart_id: number

    @Column({
        type: DataType.INTEGER,
        allowNull:false
    })
    total_price: number

    @Column({
        type: DataType.STRING,
        allowNull:false,
        validate: {
            isIn: [['pendin', 'processin','delivered','cancelled']]
        },
        defaultValue: 'pendin'
    })
    status: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isIn: [['click','payme','cash']]
        }
    })
    payment_method: string

    @BelongsTo(() => User)
    user: User

    @BelongsTo(() => Cart)
    cart: Cart    
}