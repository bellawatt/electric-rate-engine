import lodashMean from 'lodash.mean';
import { BillingDeterminantsUnits, RateElementClassification } from '../constants';

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

  map(callback: (arg: number, idx: number) => number) {
    return this.calculate().map(callback);
  }
}

export default BillingDeterminants;
