import BillingDeterminants from './_BillingDeterminants';
import { RateElementClassification, BillingDeterminantsUnits, RateElementTypeEnum } from '../constants';
import { daysPerMonth } from '../utils/assumptions';

class FixedPerDay extends BillingDeterminants {
  rateElementType = RateElementTypeEnum.FixedPerDay;
  rateElementClassification = RateElementClassification.FIXED;
  units = BillingDeterminantsUnits.DAYS;

  calculate(): Array<number> {
    return daysPerMonth();
  }
}

export default FixedPerDay;
