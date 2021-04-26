import { Injectable } from '@nestjs/common';
import * as tabletojson from 'tabletojson';
import * as camelcaseKeys from 'camelcase-keys';
import * as articleExtract from 'article-parser/index';
import { of } from 'rxjs';

@Injectable()
export class DividendesService {
  getStockPrice(name: string) {
    console.log(name);

    return articleExtract
      .extract(`https://sport-histoire.fr/Finance/Dividende_${name}`)
      .then((article) => article)
      .then((article) => {
        let rendement = null;
        const prix = article.content
          .split('action est actuellement de ')[1]
          .split('.</p><h2>')[0];

        if (
          article.content.includes(
            '. Ce dividende représente <strong>un rendement de ',
          )
        ) {
          rendement = parseFloat(
            article.content
              .split('. Ce dividende représente <strong>un rendement de ')[1]
              .split('%</strong>, selon le cours de ')[0]
              .trim()
              .replace(',', '.'),
          );
        }

        if (name == 'Hermès') {
          console.log(prix);
          console.log(rendement);
        }
        return {
          prix: prix,
          rendement: rendement,
        };
      });
  }

  getAllProchainesDividendes() {
    return tabletojson.Tabletojson.convertUrl(
      'https://sport-histoire.fr/Finance/Prochains_dividendes.php',
      (res) => {
        return camelcaseKeys(res, {
          deep: true,
          pascalCase: true,
        });
      },
    );
  }

  getSingleDividende(name: string) {
    return tabletojson.Tabletojson.convertUrl(
      `https://sport-histoire.fr/Finance/Dividende_${name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')}.php`,
      (res) => {
        return camelcaseKeys(res, {
          deep: true,
          pascalCase: true,
        });
      },
    );
  }

  getCac40Dividendes() {
    return tabletojson.Tabletojson.convertUrl(
      'https://sport-histoire.fr/Finance/CAC_40.php',
      (res) => {
        return camelcaseKeys(res, {
          deep: true,
          pascalCase: true,
        });
      },
    );
  }

  async getRentabilite() {
    let data = await this.getAllProchainesDividendes();
    data = [].concat(...data);

    const arrayPromises = [];
    data.forEach((element) => {
      arrayPromises.push(
        this.getStockPrice(
          decodeURIComponent(element.Société)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace("'", ''),
        ).catch((error) => {
          of(error);
          console.log(decodeURIComponent(element.Société), error);
        }),
      );
    });

    return {
      data: data,
      join: Promise.all(arrayPromises),
    };
  }
}
