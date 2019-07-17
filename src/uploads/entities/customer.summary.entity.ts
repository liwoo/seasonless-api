import { CustomerSummaryInterface } from '../interfaces/customerSummary.interface';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Season } from './season.entity';

@Entity()
export class CustomerSummary implements CustomerSummaryInterface {
  @PrimaryGeneratedColumn()
  public SummaryID!: number;

  public CustomerID!: number;
  public SeasonID!: number;

  @Column()
  public Credit!: string;

  @Column()
  public TotalRepaid!: string;

  @ManyToOne(type => Customer, customer => customer.summarize)
  public Customer!: Customer;

  @ManyToOne(type => Season, season => season.summarize)
  public Season!: Season;
}
