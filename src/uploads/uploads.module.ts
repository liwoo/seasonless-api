import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { Customer } from './entities/customer.entity';
import { CustomerSummary } from './entities/customer.summary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Season, Customer, CustomerSummary])],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
