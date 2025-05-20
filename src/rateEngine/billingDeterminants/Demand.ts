import { BillingDeterminantsUnits, RateElementClassification, RateElementTypeEnum } from '../constants';
import DemandProfile from '../DemandProfile';
import LoadProfile from '../LoadProfile';
import { DemandArgs, DemandPeriod } from '../types';
import BillingDeterminants from './_BillingDeterminants';

class Demand extends BillingDeterminants {
  private _loadProfile: LoadProfile;
  private _demandProfile: DemandProfile;
  private _demandPeriod: DemandPeriod;

  rateElementType = RateElementTypeEnum.Demand;
  rateElementClassification = RateElementClassification.DEMAND;
  units = BillingDeterminantsUnits.KW;

  constructor({ demandPeriod, options }: DemandArgs, loadProfile: LoadProfile) {
    super();

    this._loadProfile = loadProfile;
    this._demandPeriod = demandPeriod;

    this._demandProfile = new DemandProfile(this._loadProfile, this._demandPeriod, options || {});
  }

  calculate(): Array<number> {
    return this._demandProfile.byMonth();
  }
}

export default Demand;
