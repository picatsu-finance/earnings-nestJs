import { Param } from '@nestjs/common';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { DividendesService } from './dividendes.service';

@Controller('/dividendes')
export class DividendesController {
  constructor(private readonly dividendesService: DividendesService) {}

  @Get('/')
  async getAllProchainesDividendes(@Res() res) {
    const a = await this.dividendesService.getAllProchainesDividendes();
    res.status(HttpStatus.OK).send(a);
    res.end();
  }

  @Get('/:name')
  async getSingleDividende(@Param('name') name: string, @Res() res) {
    const a = await this.dividendesService.getSingleDividende(name);
    res.status(HttpStatus.OK).send(a);
    res.end();
  }

  @Get('/stock/price/:name')
  async getSingleStockPrice(@Param('name') name: string, @Res() res) {
    const a = await this.dividendesService.getStockPrice(name);

    res.status(HttpStatus.OK).send(a);
    res.end();
  }

  @Get('/cac40')
  async getCac40Dividendes(@Res() res) {
    const a = await this.dividendesService.getCac40Dividendes();
    res.status(HttpStatus.OK).send(a.slice(1));
    res.end();
  }

  @Get('/stocks/rentabilite')
  async getRentabiliteStockPrice(@Res() res) {
    const a = await this.dividendesService.getRentabilite();
    const data = a.data;
    let i = 0;
    a.join.then((responses: any[]) => {
      responses.forEach((response) => {
        data[i] = { ...data[i], ...response };
        i++;
      });

      data.forEach((element) => {
        if (element.rendement == null) {
          const rendement =
            (parseFloat(element.Dividende?.split(' ')[0].replace(',', '.')) *
              100) /
            parseFloat(element.prix?.split(' ')[0].replace(',', '.'));
          if (element.Société == 'Hermès') {
            console.log(element);
            console.log(rendement);
          }
          element.rendement = parseFloat(rendement.toFixed(3));
        }
      });

      res.status(HttpStatus.OK).send(data);
      res.end();
      return data;
    });
  }
}
