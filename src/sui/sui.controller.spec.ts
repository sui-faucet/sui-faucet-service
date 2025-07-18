import { Test, TestingModule } from '@nestjs/testing';
import { SuiController } from './sui.controller';

describe('SuiController', () => {
  let controller: SuiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuiController],
    }).compile();

    controller = module.get<SuiController>(SuiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
