export interface UploadServiceInterface {
  handle(fildeId: number): Promise<void>;
  // persistSeasons(seasons: Season[]): Promise<void>;
  // persistCustomers(customers: Customer[]): Promise<void>;
  // persistSummaries(summaries: CustomerSummary[]): Promise<void>;
  // makePayments(repayments: RepaymentUpload[]): Promise<void>;
}
