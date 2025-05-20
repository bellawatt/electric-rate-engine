import BillingDeterminants from './_BillingDeterminants';
import LoadProfile from '../LoadProfile';
import { RateElementClassification, BillingDeterminantsUnits, RateElementTypeEnum } from '../constants';

/**
 * @deprecated Use the unified `Demand` class instead with demandPeriod: "monthly".
 */
class MonthlyDemand extends BillingDeterminants {
  private _loadProfile: LoadProfile;

  rateElementType = RateElementTypeEnum.MonthlyDemand;
  rateElementClassification = RateElementClassification.DEMAND;
  units = BillingDeterminantsUnits.KW;

  constructor(loadProfile: LoadProfile) {
    super();
    this._loadProfile = loadProfile
    throw new Error(
      'MonthlyDemand has been deprecated. Please use RateElementTypeEnum.Demand with demandPeriod: "monthly".',
    );
  }

  calculate(): Array<number> {
    return this._loadProfile.byMonth().map((monthOfLoads) => Math.max(...monthOfLoads));
  }
}

export default MonthlyDemand;
