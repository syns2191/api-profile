import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, IUserFilter } from './interfaces/users.interface';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: Model<IUser>,
    private config: ConfigService
  ) { }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({
      email
    }).lean();

    return user;
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.userModel.findOne({
      _id: id
    });
    return user;
  }

  async validatePassword(user: IUser, plain: string) {
    return argon2.verify(user.password, plain);
  }

  async setRefreshToken(userId: string, token: string) {
    const refreshTokenHash = await argon2.hash(token);
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: {
        refreshToken: refreshTokenHash
      }}
    )
    if (!user) {
      return
    }
    return user;
  }

  async isRefreshTokenValid(userId: string, token: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) return false;
    const valid = await argon2.verify(user.refreshToken, token);
    return valid;
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async findOne(user: Partial<IUser>): Promise<IUser> {
    const userData = await this.userModel.findOne({
      email: user.email
    }).populate('skills');
    return userData;
  }

  async findAll(user: Partial<IUserFilter>): Promise<IUser[]> {
    const userData = await this.userModel.find({
      email: { $regex: user.email, $options: 'i' }
    })
    return userData;
  }

  async updateUser(userId: string, createUserDto: CreateUserDto): Promise<IUser> {
    const userUpdated = await this.userModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          github: createUserDto.github,
          linkedind: createUserDto.linkedind,
          x: createUserDto.x,
          skills: createUserDto.skills,
          profileBranding: createUserDto.profileBranding,
          profileDescription: createUserDto.profileDescription,
          profileCoverText: createUserDto.profileCoverText
        }
      }
    )
    return userUpdated;
  }

  async updatePassword(userId: string, newPassword: string, oldPassword: string): Promise<IUser> {
    const user = await this.userModel.findOne({
      _id: userId
    });
    if (!user) throw new NotFoundException('User not found');
    const oldPasswordValidate = await argon2.verify(user.password, oldPassword);
    if (!oldPasswordValidate) {
      throw new BadRequestException('Your old password is not valid');
    }
    const hashPassword = await argon2.hash(newPassword);
    const userUpdated = await this.userModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          password: hashPassword
        }
      }
    )
    return userUpdated;
  }

  async getUserSkill(_id: string): Promise<IUser[]> {
    const userSkill = await this.userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: "techstackcategories",
          let: { skillIds: "$skills" },
          pipeline: [
            { $match: { $expr: { $in: ["$stack", "$$skillIds"] } } },
            {
              $lookup: {
                from: "skillcategories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            },
            { $unwind: "$category" },
            {
              $lookup: {
                from: "techstacks",
                localField: "stack",
                foreignField: "_id",
                as: "stack"
              }
            },
            { $unwind: "$stack" },
            {
              $group: {
                _id: "$category._id",
                categoryName: { $first: "$category.categoryName" },
                skills: { $push: "$stack" }
              }
            }
          ],
          as: "skillSet"
        }
      },
      {
        $project: {
          _id: 1,
          skillSet: 1
        }
      }
    ]
    )
    return userSkill[0];
  }

}
