import { Injectable } from '@nestjs/common';
import { Model, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Refresh, RefreshDocument } from './schemas/refresh.schema';
import { CreateRefreshDto } from './dto/create-refresh.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(Refresh.name) private refreshModel: Model<RefreshDocument>,
  ) {}

  async create(createRefreshDto: CreateRefreshDto): Promise<Refresh> {
    const createdRefresh = new this.refreshModel(createRefreshDto);
    await createdRefresh.save();
    return createdRefresh;
  }

  async findById(id): Promise<RefreshDocument> {
    return await this.refreshModel.findById({ _id: id }).exec();
  }

  async initializeRefresh(id: string, refreshToken: string) {
    const refresh = await this.findById(id);
    refresh.refreshToken = refreshToken;
    await refresh.save();
    // return await refresh.generateRefreshToken();
  }
}
