import LoadProfile from '../LoadProfile';
import BillingDeterminants from './_BillingDeterminants';
import times from 'lodash.times';
import groupBy from 'lodash.groupby';
import sum from 'lodash.sum';
import { RateElementClassification, BillingDeterminantsUnits, RateElementTypeEnum } from '../constants';
import type { DemandPerDayArgs, LoadProfileFilterArgs } from '../types';

/**
 * @deprecated Use the unified `Demand` class instead with demandPeriod: "daily".
 */
class DemandPerDay extends BillingDeterminants {
  private _filters: LoadProfileFilterArgs;
  private _loadProfile: LoadProfile;

  rateElementType = RateElementTypeEnum.DemandPerDay;
  rateElementClassification = RateElementClassification.DEMAND;
  units = BillingDeterminantsUnits.KW;

  constructor(filters: DemandPerDayArgs, loadProfile: LoadProfile) {
    super();

    this._filters = filters;
    this._loadProfile = loadProfile;
    throw new Error(
      'DemandPerDay has been deprecated. Please use RateElementTypeEnum.Demand with demandPeriod: "daily".',
    );
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
      // sum the max demand for each day in the month
      return sum(dayLoads.map((day) => Math.max(...day.map(({ load }) => load))));
    });
  }
}

export default DemandPerDay;
