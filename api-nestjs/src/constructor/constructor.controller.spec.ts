import { Test, TestingModule } from '@nestjs/testing';
import { ConstructorController } from './constructor.controller';

describe('ConstructorController', () => {
  let controller: ConstructorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstructorController],
    }).compile();

    controller = module.get<ConstructorController>(ConstructorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
