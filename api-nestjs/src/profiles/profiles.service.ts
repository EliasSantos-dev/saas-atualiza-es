import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class ProfilesService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>) {}

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ id }).exec();
    if (!profile) throw new NotFoundException('Perfil não encontrado');
    return profile;
  }

  async create(data: Partial<Profile>): Promise<Profile> {
    const newProfile = new this.profileModel(data);
    return newProfile.save();
  }

  async update(id: string, data: any): Promise<void> {
    const result = await this.profileModel.updateOne({ id }, { $set: data }).exec();
    if (result.matchedCount === 0) throw new NotFoundException('Perfil não encontrado');
  }
}
