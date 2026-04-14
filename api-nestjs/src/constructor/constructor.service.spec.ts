import { Test, TestingModule } from '@nestjs/testing';
import { ConstructorService } from './constructor.service';

describe('ConstructorService', () => {
  let service: ConstructorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConstructorService],
    }).compile();

    service = module.get<ConstructorService>(ConstructorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
