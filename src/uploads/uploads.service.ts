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
import { RepaymentUploadInterface } from './interfaces/repaymentUploads.interface';
import { CustomerRepayment } from './entities/customer.repayment.entity';

@Injectable()
export class UploadsService implements UploadServiceInterface {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerSummary)
    private readonly summaryRepository: Repository<CustomerSummary>,
    @InjectRepository(CustomerRepayment)
    private readonly customerRepayment: Repository<CustomerRepayment>,
  ) {}

  async handle(fileId: number): Promise<void> {
    const file = require(`../storage/uploads-${fileId}.json`);
    // await this.persistSeasons(file.Seasons);
    // await this.persistCustomers(file.Customers);
    await this.persistCustomerSummaries(file.CustomerSummaries);
    await this.makeRepayments(file.RepaymentUploads);
  }

  private async makeRepayments(repayments: RepaymentUploadInterface[]) {
    repayments.forEach(repayment => {
      setTimeout(async () => {
        const customerSummary = await this.summaryRepository.find({
          where: { Customer: repayment.CustomerID },
          relations: ['Customer', 'Season'],
        });
        try {
          this.payCustomerSeasons(
            customerSummary,
            repayment.SeasonID === 0
              ? this.getFirstSeason()
              : repayment.SeasonID,
            Number(repayment.Amount),
          );
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    });
  }

  private getFirstSeason(): number {
    return 110;
  }

  //!-------------------- Helper Methods for Repayment ---------------------
  private payCustomerSeasons(
    customerSummary: CustomerSummary[],
    paymentSeason: number,
    repaymentAmount: number,
    payment = 0,
  ) {
    const nextPaymentSeason = this.calculateNextPaymentSeason(
      customerSummary,
      paymentSeason,
      payment,
    );

    // console.log(nextPaymentSeason);
    // const paymentSeason =
    //   seasonId !== 0 ? seasonId : nextPaymentSeason.Season.SeasonID;

    const seasonPayment = customerSummary.find(
      summary => summary.Season.SeasonID === paymentSeason,
    );

    const seasonPaymentBalance =
      Number(seasonPayment.Credit) - Number(seasonPayment.TotalRepaid);

    if (seasonPaymentBalance > repaymentAmount) {
      return this.makeTransaction(
        repaymentAmount,
        paymentSeason,
        seasonPayment,
      );
    }

    if (seasonPaymentBalance > 0 && seasonPaymentBalance < repaymentAmount) {
      this.makeTransaction(repaymentAmount, paymentSeason, seasonPayment);
      this.makeTransaction(
        seasonPaymentBalance - repaymentAmount,
        paymentSeason,
        seasonPayment,
      );

      return this.payCustomerSeasons(
        customerSummary,
        nextPaymentSeason.Season.SeasonID,
        repaymentAmount - seasonPaymentBalance,
        payment + 1,
      );
    }
  }

  private calculateNextPaymentSeason(
    customerSummary: CustomerSummary[],
    seasonId: number,
    payment: number,
  ) {
    return this.sortBySeasonAsc(
      customerSummary.filter(summary => summary.Season.SeasonID !== seasonId),
    )[payment];
  }

  private sortBySeasonAsc(customerSummary: CustomerSummary[]) {
    return customerSummary.sort(summary => -summary.Season.SeasonID);
  }

  private makeTransaction(
    repaymentAmount: number,
    seasonId: number,
    seasonPayment: CustomerSummary,
  ) {
    console.log(
      `Paying ${repaymentAmount} for ${seasonId} Season for ${seasonPayment.Customer.CustomerID}`,
    );
    console.log(
      `Editing Summary for ${seasonId} Season for ${seasonPayment.Customer.CustomerID}`,
    );
  }

  //! -------------------------------------------------------//

  private async persistCustomerSummaries(
    summaries: CustomerSummaryInterface[],
  ) {
    try {
      await this.summaryRepository.clear();
    } catch (e) {
      console.error(e);
    }

    return summaries.map(async summary => {
      const customerSummary = new CustomerSummary();
      customerSummary.Credit = summary.Credit;
      customerSummary.TotalRepaid = summary.TotalRepaid;
      customerSummary.Customer = await this.customerRepository.findOne(
        summary.CustomerID,
      );
      customerSummary.Season = await this.seasonRepository.findOne(
        summary.SeasonID,
      );

      const savedSummary = await this.summaryRepository.save(customerSummary);
      if (savedSummary.SummaryID === summaries.length)
        console.log('Saved Customer Summaries...');
      return savedSummary;
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
