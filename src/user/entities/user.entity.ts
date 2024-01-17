import {
  AfterCreate,
  AfterUpdate,
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DataType,
  Default,
  DefaultScope,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@DefaultScope(() => ({
  attributes: { exclude: ['password', 'otp', 'hashed_refresh_token'] },
}))
@Table({
  modelName: 'users',
  timestamps: true,
})
export class User extends Model {
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

  @Default(null)
  @AllowNull
  @Column
  otp: number;

  @Column
  password: string;

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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column({
    type: 'TIMESTAMP',
    allowNull: true,
    defaultValue: null,
  })
  verifiedAt: Date;

  @BeforeCreate
  static async beforeCreation(user: User) {
    // this will also be called when an user is created
    user.password = await bcrypt.hash(
      user.password,
      Number(process.env.saltOrRounds),
    );
    user.otp = Math.floor(1000 + Math.random() * 9000);
    user.createdAt = new Date();
    user.updatedAt = new Date();
  }
  @BeforeUpdate
  static async beforeUpdation(user: User) {
    // this will also be called when an user is updated
    user.otp = Math.floor(1000 + Math.random() * 9000);
    user.updatedAt = new Date();
  }

  @AfterCreate
  @AfterUpdate
  static async afterMutation(user: User) {
    // this will also be called after an user is created or updated
    delete user.dataValues.password;
    delete user.dataValues.otp;
    delete user.dataValues.hashed_refresh_token;
  }
}
