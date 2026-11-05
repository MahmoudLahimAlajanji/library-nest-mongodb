import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema.js';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('العضو غير موجود');
    return user;
  }

  async update(id: string, data: any) {
    const { password, ...safe } = data; // منع تعديل كلمة المرور من هون
    const user = await this.userModel.findByIdAndUpdate(id, safe, { new: true }).select('-password');
    if (!user) throw new NotFoundException('العضو غير موجود');
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('العضو غير موجود');
    return { message: 'تم حذف العضو' };
  }
}