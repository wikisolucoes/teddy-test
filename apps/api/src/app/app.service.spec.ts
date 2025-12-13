import { Test } from '@nestjs/testing';
import { AppService } from './app.service.js';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Teddy API"', () => {
      expect(service.getData()).toEqual({ message: 'Teddy API' });
    });
  });
});
