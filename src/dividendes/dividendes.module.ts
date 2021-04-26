import { DividendesService } from './dividendes.service';
import { DividendesController } from './dividendes.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [DividendesController],
  providers: [DividendesService],
})
export class DividendesModule {}
