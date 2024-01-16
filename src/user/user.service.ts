import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.scope('profile').create({ ...createUserDto });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.scope('profile').findAll();
  }

  async findOne(id: number): Promise<User> {
    return await this.userModel.scope('profile').findOne({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.scope('profile').findOne({
      where: {
        email,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<void> {
    await this.userModel.scope('profile').destroy({
      where: {
        id,
      },
    });
  }
}
