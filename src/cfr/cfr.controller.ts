import { Controller, Get } from '@nestjs/common';
import { CfrService } from './cfr.service';

@Controller()
export class CfrController {
  constructor(private readonly cfrService: CfrService) {}
  @Get()
  get() {
    return this.cfrService.get();
  }
}
