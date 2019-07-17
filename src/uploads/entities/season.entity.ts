import { SeasonInterface } from '../interfaces/season.interface';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { CustomerSummary } from './customer.summary.entity';

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
}
