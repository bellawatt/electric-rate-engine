import LoadProfile from '../LoadProfile';
import BillingDeterminants from './_BillingDeterminants';
import times from 'lodash/times';
import groupBy from 'lodash/groupBy';
import mean from 'lodash/mean';
import { RateElementClassification, BillingDeterminantsUnits } from '../constants';
import type { DemandPerDayAveragedArgs, LoadProfileFilterArgs } from '../types';

// This billing determinant calculates the average of the top n daily maximum loads for each month.
// It is used (for now) only for ConEd's SC1 Rate IV.

class DemandPerDayAveraged extends BillingDeterminants {
  private _filters: LoadProfileFilterArgs;
  private _numLoadsToAverage: number;
  private _loadProfile: LoadProfile;

  rateElementType = 'Demand Per Day';
  rateElementClassification = RateElementClassification.DEMAND;
  units = BillingDeterminantsUnits.KW;

  constructor({ numLoadsToAverage, ...filters }: DemandPerDayAveragedArgs, loadProfile: LoadProfile) {
    super();

    this._filters = filters;
    this._numLoadsToAverage = numLoadsToAverage;
    this._loadProfile = loadProfile;
  }

  filteredLoadProfile(): LoadProfile {
    return this._loadProfile.filterBy(this._filters);
  }

  calculate(): Array<number> {
    const months = times(12, (i) => i);
    const expanded = this.filteredLoadProfile().expanded();

    return months.map((m) => {
      const monthLoads = expanded.filter(({ month }) => m === month);

      // chunk monthly loads by day (31-element array for January, etc.)
      const dayLoads = Object.values(groupBy(monthLoads, (val) => val.date));

      // get the maximum load for each day
      const maxByDay = dayLoads.map((day) => Math.max(...day.map(({ load }) => load)));

      // take the top n max daily loads and average them
      const sorted = [...maxByDay].sort((a, b) => b - a);
      const loadsToAverage = sorted.slice(0, this._numLoadsToAverage);
      return mean(loadsToAverage);
    });
  }
}

export default DemandPerDayAveraged;
