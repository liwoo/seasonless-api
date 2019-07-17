import { UploadServiceInterface } from './interfaces/uploads.service.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeUploadsService implements UploadServiceInterface {
  async handle(fildeId: number): Promise<void> {
    console.log('handling file in a fake way');
  }
}
