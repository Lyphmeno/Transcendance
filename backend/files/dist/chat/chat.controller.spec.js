import { Test } from '@nestjs/testing';
import { ChatController } from './chat.controller.js';
describe('ChatController', () => {
    let controller;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [ChatController],
        }).compile();
        controller = module.get(ChatController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
