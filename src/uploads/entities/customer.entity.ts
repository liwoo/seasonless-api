import { CustomerInterface } from '../interfaces/customer.interface';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { CustomerSummary } from './customer.summary.entity';
import { CustomerRepayment } from './customer.repayment.entity';

@Entity()
export class Customer implements CustomerInterface {
  @PrimaryColumn()
  CustomerID: number;

  @Column()
  CustomerName: string;

  @OneToMany(type => CustomerSummary, summarize => summarize.Customer)
  public summarize!: CustomerSummary[];

  @OneToMany(type => CustomerRepayment, repay => repay.Customer)
  public repay!: CustomerRepayment[];
}
