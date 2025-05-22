import { BillingDeterminantsUnits, RateElementClassification, RateElementTypeEnum } from '../constants';
import DemandProfile from '../DemandProfile';
import LoadProfile from '../LoadProfile';
import { DemandArgs } from '../types';
import BillingDeterminants from './_BillingDeterminants';

class Demand extends BillingDeterminants {
  private _loadProfile: LoadProfile;
  private _demandProfile: DemandProfile;

  rateElementType = RateElementTypeEnum.Demand;
  rateElementClassification = RateElementClassification.DEMAND;
  units = BillingDeterminantsUnits.KW;

  constructor(args: DemandArgs, loadProfile: LoadProfile) {
    super();
    this._loadProfile = loadProfile;
    this._demandProfile = new DemandProfile(args, this._loadProfile);
  }

  calculate(): Array<number> {
    return this._demandProfile.byMonth();
  }
}

export default Demand;
