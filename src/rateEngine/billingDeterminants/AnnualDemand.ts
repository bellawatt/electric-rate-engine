import BillingDeterminants from './_BillingDeterminants';
import LoadProfile from '../LoadProfile';
import times from 'lodash/times';
import { RateElementClassification, BillingDeterminantsUnits, RateElementTypeEnum } from '../constants';

/**
 * @deprecated Use the unified `Demand` class instead with demandPeriod: "daily".
 */
class AnnualDemand extends BillingDeterminants {
  private _loadProfile: LoadProfile;

  rateElementType = RateElementTypeEnum.AnnualDemand;
  rateElementClassification = RateElementClassification.DEMAND;
  units = BillingDeterminantsUnits.KW;

  constructor(loadProfile: LoadProfile) {
    super();

    this._loadProfile = loadProfile;
    throw new Error(
      'AnnualDemand has been deprecated. Please use RateElementTypeEnum.Demand with demandPeriod: "annual".',
    );
  }

  calculate(): Array<number> {
    const annualMax = this._loadProfile.max();
    return times(12, () => annualMax);
  }
}

export default AnnualDemand;
