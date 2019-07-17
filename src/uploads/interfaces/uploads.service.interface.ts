export interface UploadServiceInterface {
  handle(fildeId: number): Promise<void>;
}
