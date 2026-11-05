import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowsService } from './borrows.service.js';
import { BorrowsController } from './borrows.controller.js';
import { Borrow, BorrowSchema } from './schemas/borrow.schema.js';
import { BooksModule } from '../books/books.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Borrow.name, schema: BorrowSchema }]),
    BooksModule, // استيراد BooksModule للوصول إلى نماذج BookCopy
  ],
  controllers: [BorrowsController],
  providers: [BorrowsService],
})
export class BorrowsModule {}