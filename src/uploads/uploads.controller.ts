import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { promises } from 'fs';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async post(@UploadedFile() file): Promise<string> {
    const fileId = await this.storeFile(file);
    await this.uploadsService.handle(fileId);
    return 'Successfully Uploaded Your File';
  }

  private async storeFile(file: any) {
    const fileArray = new Uint8Array(file.buffer);
    const files = await promises.readdir('./src/storage');
    const fileId =
      files.length > 0
        ? files.map(file => Number(file[8])).sort((a, b) => b - a)[0] + 1
        : 1;
    await promises.writeFile(`./src/storage/uploads-${fileId}.json`, fileArray);
    await promises.appendFile(`./src/storage/uploads-${fileId}.json`, '\n');
    return fileId;
  }
}
