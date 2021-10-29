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
  }

  to(scaler: number): LoadProfile {
    return new LoadProfile(
      this.loadProfile.expanded().map((loadHour) => loadHour.load * scaler),
      { year: this.loadProfile.year },
    );
  }

  toTotalKwh(totalKwh: number): LoadProfile {
    const scaler = totalKwh / this.loadProfile.sum();
    return this.to(scaler);
  }

  toAverageMonthlyBill(amount: number, rate: RateInterface): LoadProfile {
    const magnitude = Math.max(Math.floor(Math.log10(Math.abs(amount))), 0);

    const orderOfMagnitude = 10 ** magnitude;
    const initialScalerGuess = orderOfMagnitude;
    const fnParams = [initialScalerGuess, rate, this, magnitude];

    try {
      const finalScaler = goalSeek({
        fn: this.scaledMonthlyCost,
        fnParams,
        percentTolerance: 0.1,
        maxIterations: 1000,
        maxStep: 0.5 * orderOfMagnitude,
        goal: amount,
        independentVariableIdx: 0,
      });

      const scalerAsDecimal = finalScaler / orderOfMagnitude;
      return this.to(scalerAsDecimal);
    } catch (e) {
      throw e;
    }
  }

  toMonthlyKwh(monthlyKwh: Array<number>): LoadProfile {
    if (monthlyKwh.length !== 12) {
      throw 'monthlyKwh must be an array of 12 numbers';
    }
    const scalersByMonth = this.loadProfile.sumByMonth().map((kwh, idx) => {
      return monthlyKwh[idx] / kwh;
    });
    const scaledLoad = this.loadProfile.expanded().map((loadHour) => {
      return {
        ...loadHour,
        load: loadHour.load * scalersByMonth[loadHour.month],
      };
    });
    return new LoadProfile(scaledLoad, { year: this.loadProfile.year });
  }

  private scaledMonthlyCost(
    scaler: number,
    rate: RateInterface,
    context: LoadProfileScaler,
    magnitude: number,
  ): number {
    const scaledLoadProfile = context.to(scaler / 10 ** magnitude);
    const rateCalculator = new RateCalculator({
      ...rate,
      loadProfile: scaledLoadProfile,
    });

    return rateCalculator.annualCost() / 12;
  }
}

export default LoadProfileScaler;
