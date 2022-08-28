import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';

export type RefreshDocument = Refresh & Document;

@Schema({ timestamps: true })
export class Refresh {
  @Prop()
  refreshToken: string;

  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  firstname: string;

  // generateRefreshToken: Function;
}

// const { REFRESH_TOKEN_SECRET, JWT_SECRET } = process.env;

const RefreshSchema = SchemaFactory.createForClass(Refresh);

RefreshSchema.pre('save', async (next: NextFunction) => {
  const refresh = this;
  next();
});

// RefreshSchema.methods.generateRefreshToken = function () {
//   const obj = this;
//   const secret = REFRESH_TOKEN_SECRET;
//   const refreshToken = jwt.sign({ _id: obj._id }, secret, {
//     expiresIn: '10m',
//   });
//   obj.refreshToken = refreshToken;
// };

export { RefreshSchema };
