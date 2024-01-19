import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DataType,
  Default,
  DefaultScope,
  HasMany,
  HasOne,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Payment } from 'src/payment/entities/payment.entity';

@DefaultScope(() => ({
  include: [
    {
      order: [['id', 'DESC']],
      required: true,
      as: 'current_payment',
      model: Payment,
    },
  ],
}))
@Table({
  modelName: 'subscriptions',
  timestamps: true,
})
export class Subscription extends Model {
  @PrimaryKey
  @AutoIncrement
  @Index
  @Column
  id: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({
    type: DataType.VIRTUAL(DataType.STRING, ['firstName', 'lastName']),
    allowNull: true,
    defaultValue: null,
  })
  get name(): string {
    return this.get('firstName') + ' ' + this.get('lastName');
  }

  @Unique
  @Index
  @Column
  email: string;

  @Unique
  @Default(null)
  @AllowNull
  @Index
  @Column
  phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  message: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  cv: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column({
    type: 'TIMESTAMP',
    allowNull: true,
    defaultValue: null,
  })
  expiresAt: Date;

  @HasMany(() => Payment, {
    as: 'payments',
    foreignKey: 'subscription_id',
  })
  payments: Payment[];

  @HasOne(() => Payment, {
    as: 'current_payment',
    foreignKey: 'subscription_id',
  })
  current_payment: Payment;

  @BeforeCreate
  static async beforeCreation(subscription: Subscription) {
    // this will also be called when an subscription is created
    subscription.createdAt = new Date();
    subscription.updatedAt = new Date();
  }
  @BeforeUpdate
  static async beforeUpdation(subscription: Subscription) {
    // this will also be called when an subscription is updated
    subscription.updatedAt = new Date();
  }
}
