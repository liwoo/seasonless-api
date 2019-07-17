import { CustomerRepaymentInterface } from '../interfaces/customerRepayment.interface';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Season } from './season.entity';

@Entity()
export class CustomerRepayment implements CustomerRepaymentInterface {
  @PrimaryGeneratedColumn()
  public RepaymentID!: number;

  public CustomerID!: number;
  public SeasonID!: number;
  public ParentID!: number;

  @Column({ type: 'datetime' })
  public Date!: string;

  @Column()
  public Amount!: number;

  @ManyToOne(type => Customer, customer => customer.repay)
  public Customer!: Customer;

  @ManyToOne(type => Season, season => season.repay)
  public Season!: Season;

  @ManyToOne(type => CustomerRepayment, parent => parent.RepaymentID)
  public Parent!: CustomerRepayment;
}
