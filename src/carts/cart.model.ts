import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "carts" })
export class Cart extends Model<Cart> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;
}
