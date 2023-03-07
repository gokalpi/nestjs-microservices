import { CreateUserDto, UpdateUserDto, User } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    Logger.debug('UsersService@create.call', createUserDto);

    const user = await this.userRepository.save(createUserDto);

    Logger.debug('UsersService@create.result', user);

    return user;
  }

  async delete(id: string): Promise<DeleteResult> {
    Logger.debug('UsersService@delete.call', id);

    const user = await this.userRepository.delete({ id });

    Logger.debug('UsersService@delete.result', user);

    return user;
  }

  async findAll(): Promise<User[]> {
    Logger.debug('UsersService@findAll.call');

    const users = await this.userRepository.find();

    Logger.debug('UsersService@findAll.result', users);

    return users;
  }

  async findOne(id: string): Promise<User> {
    Logger.debug('UsersService@findOne.call', id);

    const user = await this.userRepository.findOneBy({ id });

    Logger.debug('UsersService@findOne.result', user);

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    Logger.debug('UsersService@findOneByEmail.call', email);

    const user = await this.userRepository.findOneBy({ email });

    Logger.debug('UsersService@findOneByEmail.result', user);

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    Logger.debug('UsersService@update.call', id, updateUserDto);

    const user = await this.userRepository.update({ id }, updateUserDto);

    Logger.debug('UsersService@update.result', user);

    return user;
  }
}
