import { SeasonInterface } from '../interfaces/season.interface';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { CustomerSummary } from './customer.summary.entity';
import { CustomerRepayment } from './customer.repayment.entity';

@Entity()
export class Season implements SeasonInterface {
  @PrimaryColumn()
  SeasonID: number;

  @Column()
  SeasonName: string;

  @Column({ type: 'datetime' })
  StartDate: string;

  @Column({ type: 'datetime', nullable: true })
  EndDate: string | null;

  @OneToMany(type => CustomerSummary, summarize => summarize.Season)
  public summarize!: CustomerSummary[];

  @OneToMany(type => CustomerRepayment, repay => repay.Season)
  public repay!: CustomerRepayment[];
}
