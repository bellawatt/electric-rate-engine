import BillingDeterminants, { BillingDeterminantsUnits } from './_BillingDeterminants';
import LoadProfile from '../LoadProfile';
import { RateElementClassification } from '../RateElement';

class MonthlyEnergy extends BillingDeterminants {
  private _loadProfile: LoadProfile;

  rateElementType = 'Monthly Energy';
  rateElementClassification = RateElementClassification.ENERGY;
  units = BillingDeterminantsUnits.KWH;

  constructor(loadProfile: LoadProfile) {
    super();

    this._loadProfile = loadProfile;
  }

  calculate(): Array<number> {
    return this._loadProfile.sumByMonth();
  }
}

export default MonthlyEnergy;
