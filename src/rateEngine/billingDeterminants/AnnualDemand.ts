import BillingDeterminants from './_BillingDeterminants';
import LoadProfile from '../LoadProfile';
import times from 'lodash/times';
import { RateElementClassification, BillingDeterminantsUnits, RateElementTypeEnum } from '../constants';

class AnnualDemand extends BillingDeterminants {
  private _loadProfile: LoadProfile;

  rateElementType = RateElementTypeEnum.AnnualDemand;
  rateElementClassification = RateElementClassification.DEMAND;
  units = BillingDeterminantsUnits.KW;

  constructor(loadProfile: LoadProfile) {
    super();

    this._loadProfile = loadProfile;
  }

  calculate(): Array<number> {
    const annualMax = this._loadProfile.max();
    return times(12, () => annualMax);
  }
}

export default AnnualDemand;
