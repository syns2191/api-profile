import { Test, TestingModule } from '@nestjs/testing';
import { TechSTackController } from './tech-stack.controller';

describe('UserController', () => {
  let controller: TechSTackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechSTackController],
    }).compile();

    controller = module.get<TechSTackController>(TechSTackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
