import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import times from 'lodash/times';
import LoadProfile from '../LoadProfile';
import BillingDeterminants from './_BillingDeterminants';
import { RateElementClassification, BillingDeterminantsUnits } from '../constants';
import { BlockedTiersArgs, LoadProfileFilterArgs } from '../types';
import convertInfinities from '../utils/convertInfinities';

class DemandTiersInMonths extends BillingDeterminants {
  private _loadProfile: LoadProfile;
  private _min: Array<number>;
  private _max: Array<number>;
  private _filters: LoadProfileFilterArgs;

  rateElementType = 'Blocked Demand Tier';
  rateElementClassification = RateElementClassification.DEMAND;
  units = BillingDeterminantsUnits.KW;

  constructor({ min, max, ...filters }: BlockedTiersArgs, loadProfile: LoadProfile) {
    super();

    this._loadProfile = loadProfile;
    this._min = convertInfinities(min);
    this._max = convertInfinities(max);
    this._filters = filters;
  }

  filteredLoadProfile(): LoadProfile {
    return this._loadProfile.filterBy(this._filters);
  }

  calculate(): Array<number> {
    const mins = this._min;
    const maxes = this._max;

    const kwByMonth = this.filteredLoadProfile().maxByMonth();

    return times(12, i => {
      const kw = kwByMonth[i] || 0;
      if (kw < mins[i]) {
        return 0;
      }
      if (kw > maxes[i]) {
        return maxes[i] - mins[i];
      }
      return kw - mins[i];
    });
  }
}

export default DemandTiersInMonths;
