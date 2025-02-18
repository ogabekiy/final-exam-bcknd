import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Order } from "src/orders/order.model";

@Table({
    tableName: 'payments'
})
export class Payment extends Model<Payment>{
    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    order_id: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    amount: number

    @BelongsTo(() => Order)
    order: Order
}