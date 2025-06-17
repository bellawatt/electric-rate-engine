import groupBy from 'lodash.groupby';
import mean from 'lodash.mean';
import sum from 'lodash.sum';
import times from 'lodash.times';
import LoadProfile from './LoadProfile';
import { AveragingDemandPeriod, DemandArgs, DemandPeriod } from './types';
import { convertInfinity } from './utils/convertInfinities';

class DemandProfile {
  private _loadProfile: LoadProfile;
  private _demandPeriod: DemandPeriod;
  private _averagingPeriod?: AveragingDemandPeriod;
  private _averagingQty?: number;

  private _min?: number;
  private _max?: number;

  constructor(
    { demandPeriod = 'monthly', averagingPeriod, averagingQty, min, max, ...filters }: DemandArgs,
    loadProfile: LoadProfile,
  ) {
    this.validatePeriods(averagingPeriod, demandPeriod);

    this._loadProfile = loadProfile.filterBy(filters ?? {});
    this._demandPeriod = demandPeriod;
    this._averagingPeriod = averagingPeriod;
    this._averagingQty = averagingQty;

    this._min = min !== undefined ? convertInfinity(min) : undefined;
    this._max = max !== undefined ? convertInfinity(max) : undefined;
  }

  byMonth(): Array<number> {
    return {
      monthly: () => this.monthlyByMonth(),
      daily: () => this.dailyByMonth(),
      annual: () => this.annualByMonth(),
    }[this._demandPeriod]();
  }

  private monthlyByMonth(): Array<number> {
    const monthlyDemand = this._loadProfile.maxByMonth().map((max) => [max]);
    const tieredDemand = this.applyTiers(monthlyDemand);
    return this.aggregateDemandByPeriod(tieredDemand);
  }

  private dailyByMonth(): Array<number> {
    const months = times(12, (i) => i);
    const expanded = this._loadProfile.expanded();

    const monthlyDemands = months.map((m: number) => {
      const monthLoads = expanded.filter(({ month }) => m === month);

      // chunk monthly loads by day (31-element array for January, etc.)
      const dayLoads = Object.values(groupBy(monthLoads, (val) => val.date));
      return dayLoads.map((day) => Math.max(...day.map(({ load }) => load)));
    });

    const tieredDemand = this.applyTiers(monthlyDemands);
    return this.aggregateDemandByPeriod(tieredDemand);
  }

  private annualByMonth(): Array<number> {
    const annualDemands = times(12, () => [this._loadProfile.max()]);

    const tieredDemand = this.applyTiers(annualDemands);
    return this.aggregateDemandByPeriod(tieredDemand);
  }

  private aggregateDemandByPeriod(monthlyDemands: Array<Array<number>>): Array<number> {
    return {
      monthly: () => this.averageMonthly(monthlyDemands),
      default: () => monthlyDemands.map((month) => sum(month)),
    }[this._averagingPeriod || 'default']();
  }

  private averageMonthly(monthlyArray: Array<Array<number>>): Array<number> {
    return monthlyArray.map((month) => {
      const sorted = month.sort((a, b) => b - a);
      const loadsToAverage = sorted.slice(0, this._averagingQty || month.length);
      return mean(loadsToAverage);
    });
  }

  private validatePeriods(averagingPeriod: AveragingDemandPeriod, demandPeriod: DemandPeriod): void {
    if (!averagingPeriod) return;

    const periodMap = {
      annual: 2,
      monthly: 1,
      daily: 0,
    };
    if (periodMap[averagingPeriod] <= periodMap[demandPeriod]) {
      throw new Error(
        `Averaging period (${averagingPeriod}) must be less granular than demand period (${demandPeriod}).`,
      );
    }
  }

  private applyTiers(monthlyDemand: Array<Array<number>>): Array<Array<number>> {
    if (this._min === undefined || this._max === undefined) {
      return monthlyDemand;
    }

    return monthlyDemand.map((monthDemands) => {
      return monthDemands.map((kw) => {
        if (kw < this._min!) {
          return 0;
        }
        if (kw > this._max!) {
          return this._max! - this._min!;
        }
        return kw - this._min!;
      });
    });
  }
}

export default DemandProfile;
