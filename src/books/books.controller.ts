import { BooksService } from './books.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../user/schema/user.schema.js';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // للمشرفين فقط
  @Post()
  createBook(@Body() data: any) {
    return this.booksService.createBook(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/copies')
  addCopy(@Param('id') id: string) {
    return this.booksService.addCopy(id);
  }

  @Get() // متاح للجميع
  findAll() {
    return this.booksService.findAllBooks();
  }

    @UseGuards(JwtAuthGuard)
  @Get('available')
  findAvailable() {
    return this.booksService.findAvailable();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  updateBook(@Param('id') id: string, @Body() data: any) {
    return this.booksService.updateBook(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteBook(@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }
}