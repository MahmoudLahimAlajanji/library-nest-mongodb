import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BorrowDocument = HydratedDocument<Borrow>;

@Schema({ timestamps: true })
export class Borrow {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'BookCopy', required: true })
  copyId: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  borrowingDate: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ default: null })
  actualReturnDate: Date;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);