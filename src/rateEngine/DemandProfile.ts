import { groupBy, mean, sum, times } from 'lodash';
import LoadProfile from './LoadProfile';
import { AveragingDemandPeriod, DemandOptions, DemandPeriod } from './types';
import convertInfinities from './utils/convertInfinities';

class DemandProfile {
  private _loadProfile: LoadProfile;
  private _demandPeriod: DemandPeriod;
  private _averagingPeriod: AveragingDemandPeriod | undefined;
  private _averagingQty: number | undefined;

  private _min: Array<number> | null;
  private _max: Array<number> | null;

  constructor(
    loadProfile: LoadProfile,
    demandPeriod: DemandPeriod = 'monthly',
    { averagingPeriod, averagingQty, min, max, filters }: Partial<DemandOptions> = {},
  ) {
    this.validatePeriods(averagingPeriod, demandPeriod);

    this._loadProfile = loadProfile.filterBy(filters ?? {});
    this._demandPeriod = demandPeriod;
    this._averagingPeriod = averagingPeriod;
    this._averagingQty = averagingQty;

    this._min = min ? convertInfinities(min) : null;
    this._max = max ? convertInfinities(max) : null;
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
    if (!this._min || !this._max) {
      return monthlyDemand;
    }

    return monthlyDemand.map((monthDemands, i) => {
      return monthDemands.map((kw) => {
        if (kw < this._min![i]) {
          return 0;
        }
        if (kw > this._max![i]) {
          return this._max![i] - this._min![i];
        }
        return kw - this._min![i];
      });
    });
  }
}

export default DemandProfile;
