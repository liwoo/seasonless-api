import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController } from './uploads.controller';
import { promises } from 'fs';
import { FakeUploadsService } from './uploads.service.fake';
import { UploadsService } from './uploads.service';
import { UploadServiceInterface } from './interfaces/uploads.service.interface';

describe('Uploads Controller', () => {
  let controller: UploadsController;
  let service: FakeUploadsService;

  afterEach(async () => {
    const files = await promises.readdir('./src/storage');
    files.forEach(async file => await promises.unlink(`./src/storage/${file}`));
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
      providers: [UploadsService],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
    service = module.get<UploadsService>(UploadsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should store file in file system', async () => {
    const file = await promises.readFile('./src/fixtures/uploaded-file.json');
    await controller.post({ buffer: file });
    const storedFile = require('../storage/uploads-1.json');
    expect(storedFile).toBeTruthy();
  });

  it('should store more than one file in the file system', async () => {
    const file = await promises.readFile('./src/fixtures/uploaded-file.json');
    await controller.post({ buffer: file });
    await controller.post({ buffer: file });
    await controller.post({ buffer: file });
    const storedFile = require('../storage/uploads-1.json');
    const storedFile2 = require('../storage/uploads-2.json');
    const storedFile3 = require('../storage/uploads-3.json');
    expect(storedFile).toBeTruthy;
    expect(storedFile2).toBeTruthy;
    expect(storedFile3).toBeTruthy;
  });

  it('should fire a handle file event after upload', async () => {
    //Arrange
    const file = await promises.readFile('./src/fixtures/uploaded-file.json');
    jest.spyOn(service, 'handle');

    //Act
    const response = await controller.post({ buffer: file });
    //Assert
    expect(service.handle).toHaveBeenCalledWith(1);
    expect(response).toBe('Successfully Uploaded File');
  });
});
