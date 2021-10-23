import { default as lodashMean } from 'lodash/mean';
import { RateElementClassification } from '../RateElement';

export enum BillingDeterminantsUnits {
  KWH = 'kWh',
  KW = 'kW',
  DAYS = 'days',
  MONTHS = 'months',
  DOLLARS = 'dollars',
}

abstract class BillingDeterminants {
  abstract rateElementType: string;
  abstract rateElementClassification: RateElementClassification;
  abstract units: BillingDeterminantsUnits;
  abstract calculate(): Array<number>;

  mean(): number {
    return lodashMean(this.calculate());
  }

  all(): Array<number> {
    return this.calculate();
  }

  map(callback: (arg: number, idx: number) => any) {
    return this.calculate().map(callback);
  }
}

export default BillingDeterminants;
