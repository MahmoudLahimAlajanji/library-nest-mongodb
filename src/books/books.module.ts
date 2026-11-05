import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './books.service.js';
import { BooksController } from './books.controller.js';
import { Book, BookSchema } from './schemas/books.schema.js';
import { BookCopy, BookCopySchema } from './schemas/book-copy.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: BookCopy.name, schema: BookCopySchema },
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, MongooseModule], // تصدير MongooseModule لنستخدم النماذج في الاستعارة
})
export class BooksModule {}