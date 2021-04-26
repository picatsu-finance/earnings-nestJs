import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private _service: HttpService) {}
}
