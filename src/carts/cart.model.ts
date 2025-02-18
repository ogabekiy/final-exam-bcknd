import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { CartProducts } from "src/cart_products/cart_product.model";  // Ensure correct import path
import { User } from "src/users/user.model";

@Table({ tableName: "carts" })
export class Cart extends Model<Cart> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [['active', 'ordered']],
    },
    defaultValue: "active",
  })
  status: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => CartProducts) 
  cart_products: CartProducts[]; 
}
