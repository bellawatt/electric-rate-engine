import BillingDeterminants, { BillingDeterminantsUnits } from './_BillingDeterminants';
import LoadProfile from '../LoadProfile';
import {LoadProfileFilterArgs} from '../LoadProfileFilter';
import { RateElementClassification } from '../RateElement';

export interface EnergyTimeOfUseArgs {
  months: Array<number>;
  daysOfWeek?: Array<number>;
  hourStarts: Array<number>;
  onlyOnDays: Array<string>;
  exceptForDays: Array<string>;
}

class EnergyTimeOfUse extends BillingDeterminants {
  private _filters: LoadProfileFilterArgs;
  private _loadProfile: LoadProfile;

  rateElementType = 'Time Of Use';
  rateElementClassification = RateElementClassification.ENERGY;
  units = BillingDeterminantsUnits.KWH;

  constructor(filters: EnergyTimeOfUseArgs, loadProfile: LoadProfile) {
    super();

    this._filters = filters;
    this._loadProfile = loadProfile;
  }

  filteredLoadProfile(): LoadProfile {
    return this._loadProfile.filterBy(this._filters);
  }

  calculate(): Array<number> {
    return this.filteredLoadProfile().sumByMonth();
  }
}

export default EnergyTimeOfUse;
