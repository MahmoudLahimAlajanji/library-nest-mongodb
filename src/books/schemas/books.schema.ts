import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  isbn: string;

  @Prop()
  publicationDate: Date;

  @Prop()
  genre: string;

  @Prop()
  additionalDetails: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);