import BillingDeterminants from './_BillingDeterminants';
import times from 'lodash/times';
import { RateElementClassification, BillingDeterminantsUnits, RateElementTypeEnum } from '../constants';

const MONTHS_PER_YEAR = 12;

class FixedPerMonth extends BillingDeterminants {
  rateElementType = RateElementTypeEnum.FixedPerMonth;
  rateElementClassification = RateElementClassification.FIXED;
  units = BillingDeterminantsUnits.MONTHS;

  calculate(): Array<number> {
    return times(MONTHS_PER_YEAR, () => 1);
  }
}

export default FixedPerMonth;
