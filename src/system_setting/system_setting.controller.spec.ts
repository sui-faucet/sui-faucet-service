import { Test, TestingModule } from '@nestjs/testing';
import { SystemSettingController } from './system_setting.controller';

describe('SystemSettingController', () => {
  let controller: SystemSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemSettingController],
    }).compile();

    controller = module.get<SystemSettingController>(SystemSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
