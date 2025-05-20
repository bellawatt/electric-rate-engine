import LoadProfile from '../LoadProfile';
import BillingDeterminants from './_BillingDeterminants';
import { RateElementClassification, BillingDeterminantsUnits, RateElementTypeEnum } from '../constants';
import type { DemandTimeOfUseArgs, LoadProfileFilterArgs } from '../types';

/**
 * @deprecated Use the unified `Demand` class instead with load profile filters for time-of-use logic.
 */
class DemandTimeOfUse extends BillingDeterminants {
  private _filters: LoadProfileFilterArgs;
  private _loadProfile: LoadProfile;

  rateElementType = RateElementTypeEnum.DemandTimeOfUse;
  rateElementClassification = RateElementClassification.DEMAND;
  units = BillingDeterminantsUnits.KW;

  constructor(filters: DemandTimeOfUseArgs, loadProfile: LoadProfile) {
    super();

    this._filters = filters;
    this._loadProfile = loadProfile;
    throw new Error(
      'DemandTimeOfUse has been deprecated. Please use RateElementTypeEnum.Demand with load profile filters for time-of-use logic.',
    );
  }

  filteredLoadProfile(): LoadProfile {
    return this._loadProfile.filterBy(this._filters);
  }

  calculate(): Array<number> {
    return this.filteredLoadProfile().maxByMonth();
  }
}

export default DemandTimeOfUse;
