import { DividendesModule } from './dividendes/dividendes.module';
import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActuatorModule } from '@glosur/nestjs-actuator';

@Module({
  imports: [
    DividendesModule,
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5,
    }),
    ActuatorModule.forRoot({
      registration: {
        adminServerUrl: 'http://146.59.195.214:9090',
        name: 'NestJs-Earnings',
        serviceUrl: 'http://146.59.195.214:4000',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
