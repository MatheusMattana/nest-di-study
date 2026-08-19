import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ComputerModule } from './../src/computer/computer.module';

describe('ComputerController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ComputerModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/computer (GET)', () => {
    return request(app.getHttpServer())
      .get('/computer')
      .expect(200)
      .expect({ cpuResult: 15, diskData: 'Disk data' });
  });

  it('/computer/boot then /computer/status (GET)', async () => {
    await request(app.getHttpServer()).post('/computer/boot').expect(201);

    return request(app.getHttpServer()).get('/computer/status').expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
