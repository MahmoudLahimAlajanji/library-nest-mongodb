import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from './schemas/books.schema.js';
import { BookCopy, BookCopyDocument } from './schemas/book-copy.schema.js';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(BookCopy.name) private bookCopyModel: Model<BookCopyDocument>,
  ) {}

  // 1. إضافة كتاب جديد
  async createBook(data: any) {
    const book = new this.bookModel(data);
    return await book.save();
  }

  // 2. إضافة نسخة لكتاب موجود
  async addCopy(bookId: string) {
    const book = await this.bookModel.findById(bookId);
    if (!book) throw new NotFoundException('الكتاب غير موجود');

    const copy = new this.bookCopyModel({ bookId: new Types.ObjectId(bookId), availabilityStatus: true });
    return await copy.save();
  }

  // 3. عرض كافة الكتب مع عدد النسخ المتاحة
  async findAllBooks() {
    return await this.bookModel.find().exec();
  }

    // الكتب المتاحة (فيها نسخة وحدة على الأقل) مع عدد النسخ المتاحة
  async findAvailable() {
    return this.bookCopyModel.aggregate([
      { $match: { availabilityStatus: true } },
      { $group: { _id: '$bookId', availableCopies: { $sum: 1 } } },
      { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
      { $unwind: '$book' },
      { $project: { _id: 0, availableCopies: 1, book: 1 } },
    ]);
  }

  async updateBook(id: string, data: any) {
    const book = await this.bookModel.findByIdAndUpdate(id, data, { new: true });
    if (!book) throw new NotFoundException('الكتاب غير موجود');
    return book;
  }

  async deleteBook(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException('الكتاب غير موجود');
    const borrowed = await this.bookCopyModel.countDocuments({ bookId: book._id, availabilityStatus: false });
    if (borrowed > 0) throw new BadRequestException('لا يمكن حذف كتاب لديه نسخ مستعارة حالياً');
    await this.bookCopyModel.deleteMany({ bookId: book._id });
    await book.deleteOne();
    return { message: 'تم حذف الكتاب ونسخه' };
  }
}