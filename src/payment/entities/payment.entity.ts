import {
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@DefaultScope(() => ({
  attributes: { exclude: ['payment_signature'] },
}))
@Table({
  modelName: 'payments',
  timestamps: true,
})
export class Payment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Index
  @Column
  id: number;

  @Column
  amount: string;

  @Unique
  @Index
  @Column({
    type: DataType.TEXT,
  })
  order_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  payment_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  payment_signature: string;

  @Index
  @BelongsTo(() => Subscription, {
    as: 'subscriptions',
    foreignKey: 'subscription_id',
  })
  @Column({
    allowNull: true,
    defaultValue: null,
  })
  subscription_id: number | null;

  @Column({
    defaultValue: 'PAYMENT_PENDING',
  })
  status: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeCreate
  static async beforeCreation(payment: Payment) {
    // this will also be called when an payment is created
    payment.createdAt = new Date();
    payment.updatedAt = new Date();
  }
  @BeforeUpdate
  static async beforeUpdation(payment: Payment) {
    // this will also be called when an payment is updated
    payment.updatedAt = new Date();
  }
}
