import BillingDeterminants, { BillingDeterminantsUnits } from './_BillingDeterminants';
import times from 'lodash/times';
import { RateElementClassification } from '../RateElement';

const MONTHS_PER_YEAR = 12;

class FixedPerMonth extends BillingDeterminants {
  rateElementType = 'Fixed Per Month';
  rateElementClassification = RateElementClassification.FIXED;
  units = BillingDeterminantsUnits.MONTHS;

  calculate(): Array<number> {
    return times(MONTHS_PER_YEAR, () => 1);
  }
}

export default FixedPerMonth;
