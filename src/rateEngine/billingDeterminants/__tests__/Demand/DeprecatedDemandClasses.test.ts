import LoadProfile from '../../../LoadProfile';
import AnnualDemand from '../../AnnualDemand';
import DemandPerDay from '../../DemandPerDay';
import DemandTiersInMonths from '../../DemandTiersInMonths';
import DemandTimeOfUse from '../../DemandTimeOfUse';
import MonthlyDemand from '../../MonthlyDemand';

describe('Deprecated Demand Classes', () => {
  it('throws an error when AnnualDemand is instantiated', () => {
    expect(() => {
      new AnnualDemand(new LoadProfile([], { year: 2019 }));
    }).toThrow('AnnualDemand has been deprecated. Please use RateElementTypeEnum.Demand with demandPeriod: "annual".');
  });

  it('throws an error when MonthlyDemand is instantiated', () => {
    expect(() => {
      new MonthlyDemand(new LoadProfile([], { year: 2019 }));
    }).toThrow(
      'MonthlyDemand has been deprecated. Please use RateElementTypeEnum.Demand with demandPeriod: "monthly".',
    );
  });

  it('throws an error when DemandTimeOfUse is instantiated', () => {
    expect(() => {
      new DemandTimeOfUse({}, new LoadProfile([], { year: 2019 }));
    }).toThrow(
      'DemandTimeOfUse has been deprecated. Please use RateElementTypeEnum.Demand with load profile filters for time-of-use logic.',
    );
  });

  it('throws an error when DemandTiersInMonths is instantiated', () => {
    expect(() => {
      new DemandTiersInMonths({ min: [], max: [] }, new LoadProfile([], { year: 2019 }));
    }).toThrow('DemandTiersInMonths is deprecated. Use RateElementTypeEnum.Demand with tiered rateComponents.');
  });

  it('throws an error when DemandPerDay is instantiated', () => {
    expect(() => {
      new DemandPerDay({}, new LoadProfile([], { year: 2019 }));
    }).toThrow('DemandPerDay has been deprecated. Please use RateElementTypeEnum.Demand with demandPeriod: "daily".');
  });
});
