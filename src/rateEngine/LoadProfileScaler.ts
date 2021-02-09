import LoadProfile from './LoadProfile';
import RateCalculator from './RateCalculator';
import goalSeek from 'goal-seek';
import RateInterface from './RateInterface';

// TODO: use proper math for scaling
// TODO: fix the toAverageMonthlyBill argument... how to properly pass in a rate?
class LoadProfileScaler {
  loadProfile: LoadProfile;

  constructor(loadProfile) {
    this.loadProfile = loadProfile;
  };

  to(scaler: number): LoadProfile {
    return new LoadProfile(
      this.loadProfile.expanded().map(loadHour => loadHour.load * scaler),
      {year: this.loadProfile.year}
    );
  }

  toTotalKwh(totalKwh: number): LoadProfile {
    const scaler = totalKwh / this.loadProfile.sum();
    return this.to(scaler);
  }

  toAverageMonthlyBill(
    amount: number,
    rate: RateInterface
  ): LoadProfile {
    // Need this as a percent for better resolution within the algorithm
    const scalerAsPercent = 100;
    const fnParams = [scalerAsPercent, rate, this];

    try {
      const finalScalerAsPercent = goalSeek({
        fn: this.scaledMonthlyCost,
        fnParams,
        percentTolerance: 0.1,
        maxIterations: 1000,
        maxStep: 50,
        goal: amount,
        independentVariableIdx: 0
      });
      return this.to(finalScalerAsPercent / 100);
    } catch (e) {
      throw(e);
    }
  }

  toMonthlyKwh(monthlyKwh: Array<number>): LoadProfile {
    const scalersByMonth = this.loadProfile.sumByMonth().map((kwh, idx) => {
      return monthlyKwh[idx] / kwh;
    });
    const scaledLoad = this.loadProfile.expanded().map(loadHour => {
      return {
        ...loadHour,
        load: loadHour.load * scalersByMonth[loadHour.month],
      };
    });
    return new LoadProfile(scaledLoad, {year: this.loadProfile.year});
  }

  private scaledMonthlyCost(
    scalerAsPercent: number,
    rate: RateInterface,
    context: LoadProfileScaler,
  ): number {
    const scaledLoadProfile = context.to(scalerAsPercent / 100);
    const rateCalculator = new RateCalculator({
      ...rate,
      loadProfile: scaledLoadProfile,
    });
    return rateCalculator.annualCost() / 12;
  };
};

export default LoadProfileScaler;
