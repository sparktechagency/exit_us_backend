import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';
import { TranslatorService } from '../app/modules/translateor/translator.service';

const socket = (io: Server) => {
  io.on('connection', socket => {
    logger.info(colors.blue('A user connected'));
    TranslatorService.realTimeVoiceTranslate(socket)
    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
