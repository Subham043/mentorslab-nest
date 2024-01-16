import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import sequelize from 'sequelize';

@Scopes(() => ({
  withoutPassword: {
    attributes: { exclude: ['password'] },
  },
}))
@Table({
  modelName: 'users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
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
  @Column
  email: string;

  @Unique
  @Default(null)
  @AllowNull
  @Column
  phone: string;

  @Default(null)
  @AllowNull
  @Column
  otp: number;

  @Column
  get password(): string {
    return this.getDataValue('password');
  }

  set password(value: string) {
    this.setDataValue(
      'password',
      bcrypt.hash(value, Number(process.env.saltOrRounds)),
    );
  }

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  hashed_refresh_token: string;

  @Column({
    defaultValue: 'USER',
  })
  role: string;

  @Column({ defaultValue: false })
  isVerified: boolean;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  })
  createdAt: Date;

  @Column({
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  })
  updatedAt: Date;

  @Column({
    type: 'TIMESTAMP',
    allowNull: true,
    defaultValue: null,
  })
  verifiedAt: Date;
}
