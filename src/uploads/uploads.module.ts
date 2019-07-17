import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { Customer } from './entities/customer.entity';
import { CustomerSummary } from './entities/customer.summary.entity';
import { CustomerRepayment } from './entities/customer.repayment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Season,
      Customer,
      CustomerSummary,
      CustomerRepayment,
    ]),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
