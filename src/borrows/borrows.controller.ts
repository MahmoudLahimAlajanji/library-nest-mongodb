import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { BorrowsService } from './borrows.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../user/schema/user.schema.js';

@UseGuards(JwtAuthGuard) // الاستعارة تتطلب تسجيل دخول
@Controller('borrows')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Post(':bookId/borrow')
  borrowBook(@Request() req: any, @Param('bookId') bookId: string) {
    return this.borrowsService.borrowBook(req.user.id, bookId);
  }

  @Post(':borrowId/return')
  returnBook(@Request() req: any, @Param('borrowId') borrowId: string) {
    return this.borrowsService.returnBook(borrowId, req.user);
  }

  // استعارات العضو الحالي
  @Get('my')
  findMine(@Request() req: any) {
    return this.borrowsService.findMine(req.user.id);
  }

  // كل الاستعارات الحالية - للموظف فقط
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('current')
  findCurrent() {
    return this.borrowsService.findCurrent();
  }
}