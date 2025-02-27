import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { CartProducts } from "src/cart_products/cart_product.model";
import { Category } from "src/categories/category.model";
import { Like } from "src/likes/like.model";
import { Review } from "src/reviews/review.model";
import { User } from "src/users/user.model";

@Table({tableName: "products"})
export class Product extends Model<Product>{
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull:false
    })
    seller_id: number

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull:false
    })
    category_id: number

    @Column({
        type: DataType.INTEGER,
        allowNull:false
    })
    price: number

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    description: string

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      })
      approved: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull:false
    })
    quantity: number

    @Column({
        type: DataType.FLOAT,
        allowNull:true
    })
    totalrating: number

    

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false,
    })
    images: string[];

    @BelongsTo(() => User)
    seller: User

    @BelongsTo(() => Category)
    category: Category

    @HasMany(() => Review)
    reviews: Review[]

    @HasMany(() => CartProducts)
    cart_product: CartProducts[]


    @HasMany(() => Like)
    likes: Like[]
}