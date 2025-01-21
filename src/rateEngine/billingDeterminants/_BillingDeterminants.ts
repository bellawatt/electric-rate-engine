import {mean} from "lodash-es";
import { BillingDeterminantsUnits, RateElementClassification } from '../constants/index.ts';

abstract class BillingDeterminants {
  abstract rateElementType: string;
  abstract rateElementClassification: RateElementClassification;
  abstract units: BillingDeterminantsUnits;
  abstract calculate(): Array<number>;

  mean(): number {
    return mean(this.calculate());
  }

  all(): Array<number> {
    return this.calculate();
  }

  map(callback: (arg: number, idx: number) => number) {
    return this.calculate().map(callback);
  }
}

export default BillingDeterminants;
