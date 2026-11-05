import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module.js';
import { BooksModule } from './books/books.module.js';
import { BorrowsModule } from './borrows/borrows.module.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/library_db'),
    AuthModule,
    BooksModule,
    BorrowsModule,
    UserModule,
  ],
})
export class AppModule {}