import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { CartProducts } from "src/cart_products/cart_product.model";
import { Cart } from "src/carts/cart.model";
import { Order } from "src/orders/order.model";
import { Product } from "src/products/product.model";
import { Review } from "src/reviews/review.model";

@Table({tableName: 'users'})
export class User extends Model<User>{
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    firstname: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    surname: string

    @Column({
        type: DataType.STRING(),
        allowNull: false,
        unique: true,
        validate :{
            isEmail: true
        }
    })
    email: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {
            isIn: [['user', 'seller','admin']]
        }
    })
    role: string

    @Column({
        type: DataType.STRING(9),
        allowNull: false,
        unique: true,
        validate: {
            len: [9, 9] 
        }
    })
    phone: string

    @Column({
        type: DataType.TEXT,
        allowNull:true,
        validate: {
            isIn: [['male', 'female']]
        }
    })
    gender: string

    @Column({
        type: DataType.INTEGER,
        allowNull:true,
    })
    age: number

    @HasMany(() => Product)
    products: Product[]

    @HasMany(() => Review)
    reviews: Review[]

    @HasMany(() => CartProducts)
    cart_products: CartProducts[]

    @HasMany(() => Cart)
    carts: Cart[]

    @HasMany(() => Order)
    order: Order[]
}