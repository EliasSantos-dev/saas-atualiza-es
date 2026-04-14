import { Test, TestingModule } from '@nestjs/testing';
import { TaggerService } from './tagger.service';

describe('TaggerService', () => {
  let service: TaggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaggerService],
    }).compile();

    service = module.get<TaggerService>(TaggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
