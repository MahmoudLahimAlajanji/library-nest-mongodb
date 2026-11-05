import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookCopyDocument = HydratedDocument<BookCopy>;

@Schema({ timestamps: true })
export class BookCopy {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  bookId: Types.ObjectId;

  // true = متاح (Available), false = مستعار
  @Prop({ default: true })
  availabilityStatus: boolean; 
}

export const BookCopySchema = SchemaFactory.createForClass(BookCopy);