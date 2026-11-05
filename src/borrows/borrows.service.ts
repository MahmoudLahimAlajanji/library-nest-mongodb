import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Borrow, BorrowDocument } from './schemas/borrow.schema.js';
import { BookCopy, BookCopyDocument } from '../books/schemas/book-copy.schema.js';

@Injectable()
export class BorrowsService {
  constructor(
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
    @InjectModel(BookCopy.name) private bookCopyModel: Model<BookCopyDocument>,
  ) {}

  // 1. استعارة كتاب
  async borrowBook(userId: string, bookId: string) {
    // منع العضو من استعارة نفس الكتاب مرتين بنفس الوقت
    const copiesOfThisBook = await this.bookCopyModel.find({ bookId: new Types.ObjectId(bookId) });
    const copyIds = copiesOfThisBook.map(c => c._id);

    const activeBorrow = await this.borrowModel.findOne({
      userId: new Types.ObjectId(userId),
      copyId: { $in: copyIds },
      actualReturnDate: null,
    });

    if (activeBorrow) {
      throw new BadRequestException('لقد قمت باستعارة نسخة من هذا الكتاب ولم تقم بإرجاعها بعد');
    }

    // حجز أول نسخة متاحة بعملية وحدة (بدون تعارض)
    const availableCopy = await this.bookCopyModel.findOneAndUpdate(
      { bookId: new Types.ObjectId(bookId), availabilityStatus: true },
      { availabilityStatus: false },
      { new: true },
    );

    if (!availableCopy) {
      throw new BadRequestException('عذراً، لا توجد نسخ متاحة من هذا الكتاب حالياً');
    }

    // تاريخ الإرجاع بعد 14 يوم
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrowRecord = new this.borrowModel({
      userId: new Types.ObjectId(userId),
      copyId: availableCopy._id,
      dueDate: dueDate,
    });

    return await borrowRecord.save();
  }

  // 2. إرجاع الكتاب (صاحب الاستعارة أو الموظف فقط)
  async returnBook(borrowId: string, user: any) {
    const borrowRecord = await this.borrowModel.findById(borrowId);
    if (!borrowRecord || borrowRecord.actualReturnDate !== null) {
      throw new NotFoundException('سجل الاستعارة غير صالح أو تم إرجاع الكتاب مسبقاً');
    }

    if (user.role !== 'admin' && borrowRecord.userId.toString() !== user.id) {
      throw new ForbiddenException('لا يمكنك إرجاع استعارة عضو آخر');
    }

    borrowRecord.actualReturnDate = new Date();
    await borrowRecord.save();

    await this.bookCopyModel.findByIdAndUpdate(borrowRecord.copyId, {
      availabilityStatus: true,
    });

    return { message: 'تم إرجاع الكتاب بنجاح' };
  }

  // 3. كل الاستعارات الحالية (غير المرجعة) - للموظف
  findCurrent() {
    return this.borrowModel
      .find({ actualReturnDate: null })
      .populate('userId', 'name email libraryCardNumber')
      .populate({ path: 'copyId', populate: { path: 'bookId', select: 'title isbn' } })
      .exec();
  }

  // 4. استعارات العضو نفسه
  findMine(userId: string) {
    return this.borrowModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate({ path: 'copyId', populate: { path: 'bookId', select: 'title isbn' } })
      .exec();
  }
}