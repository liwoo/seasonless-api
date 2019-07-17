import { Injectable } from '@nestjs/common';
import { UploadServiceInterface } from './interfaces/uploads.service.interface';
import { SeasonInterface } from './interfaces/season.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { Repository } from 'typeorm';
import { CustomerInterface } from './interfaces/customer.interface';
import { Customer } from './entities/customer.entity';
import { CustomerSummaryInterface } from './interfaces/customerSummary.interface';
import { CustomerSummary } from './entities/customer.summary.entity';

@Injectable()
export class UploadsService implements UploadServiceInterface {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerSummary)
    private readonly summaryRepository: Repository<CustomerSummary>,
  ) {}

  async handle(fileId: number): Promise<void> {
    const file = require(`../storage/uploads-${fileId}.json`);
    // await this.persistSeasons(file.Seasons);
    // await this.persistCustomers(file.Customers);
    await this.persistCustomerSummaries(file.CustomerSummaries);
  }

  private async persistCustomerSummaries(
    summaries: CustomerSummaryInterface[],
  ) {
    summaries.forEach(async summary => {
      try {
        const customerSummary = new CustomerSummary();
        customerSummary.Credit = summary.Credit;
        customerSummary.TotalRepaid = summary.TotalRepaid;
        customerSummary.Customer = await this.customerRepository.findOne(
          summary.CustomerID,
        );
        customerSummary.Season = await this.seasonRepository.findOne(
          summary.SeasonID,
        );

        const savedSummaries = await this.summaryRepository.save(
          customerSummary,
        );
        console.log(savedSummaries);
      } catch (e) {
        console.error(e);
      }
    });
  }

  private async persistCustomers(customers: CustomerInterface[]) {
    try {
      const savedCustomers = await this.customerRepository.save(customers);
      console.log(savedCustomers);
    } catch (e) {
      console.error(e);
    }
  }

  private async persistSeasons(seasons: SeasonInterface[]) {
    const cleanSeasons = seasons.map(season => {
      return {
        ...season,
        StartDate: this.toMySQLDate(season.StartDate),
        EndDate:
          Number(season.EndDate) === 0
            ? null
            : this.toMySQLDate(season.EndDate),
      };
    });

    try {
      const savedSeasons = await this.seasonRepository.save(cleanSeasons);
      console.log(savedSeasons);
    } catch (e) {
      console.error(e);
    }
  }

  private toMySQLDate(date: string): string {
    return new Date(date)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
  }
}
