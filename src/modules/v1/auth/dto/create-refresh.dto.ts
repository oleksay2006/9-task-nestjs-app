import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CreateRefreshDto {
  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  firstname: string;
}
