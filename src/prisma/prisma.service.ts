import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
@Injectable()
export class PrismaService
extends PrismaClient
implements OnModuleInit, OnModuleDestroy
{
constructor(configService: ConfigService) {
const adapter = new PrismaPg({
connectionString: configService.getOrThrow<string>('DATABASE_URL'),
});
super({ adapter });
}
async onModuleInit() {
await this.$connect(); // يتصل عند تشغيل التطبيق
}
async onModuleDestroy() {
await this.$disconnect(); // يسكّر الاتصال عند الإيقاف
}
}