import AnnualDemand from './billingDeterminants/AnnualDemand';
import BlockedTiersInDays from './billingDeterminants/BlockedTiersInDays';
import BlockedTiersInMonths from './billingDeterminants/BlockedTiersInMonths';
import DemandPerDay from './billingDeterminants/DemandPerDay';
import DemandPerDayAveraged from './billingDeterminants/DemandPerDayAveraged';
import DemandTiersInMonths from './billingDeterminants/DemandTiersInMonths';
import DemandTimeOfUse from './billingDeterminants/DemandTimeOfUse';
import EnergyTimeOfUse from './billingDeterminants/EnergyTimeOfUse';
import FixedPerDay from './billingDeterminants/FixedPerDay';
import FixedPerMonth from './billingDeterminants/FixedPerMonth';
import HourlyEnergy from './billingDeterminants/HourlyEnergy';
import MonthlyDemand from './billingDeterminants/MonthlyDemand';
import MonthlyEnergy from './billingDeterminants/MonthlyEnergy';
import SurchargeAsPercent from './billingDeterminants/SurchargeAsPercent';
import LoadProfile from './LoadProfile';
import type {
  ProcessedRateElementInterface,
} from './types';

class BillingDeterminantsFactory {
  static make(
    rateElement: ProcessedRateElementInterface,
    loadProfile: LoadProfile,
  ) {
    const { rateElementType, rateComponents } = rateElement;
    switch (rateElementType) {
      case 'EnergyTimeOfUse':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new EnergyTimeOfUse(args, loadProfile) }));
      case 'BlockedTiersInDays':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new BlockedTiersInDays(args, loadProfile) }));
      case 'BlockedTiersInMonths':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new BlockedTiersInMonths(args, loadProfile) }));
      case 'FixedPerDay':
        return rateComponents.map(({ charge, name, }) => ({ charge, name, billingDeterminants: new FixedPerDay() }));
      case 'FixedPerMonth':
        return rateComponents.map(({ charge, name, }) => ({ charge, name, billingDeterminants: new FixedPerMonth() }));
      case 'MonthlyDemand':
        return rateComponents.map(({ charge, name, }) => ({ charge, name, billingDeterminants: new MonthlyDemand(loadProfile) }));
      case 'AnnualDemand':
        return rateComponents.map(({ charge, name, }) => ({ charge, name, billingDeterminants: new AnnualDemand(loadProfile) }));
      case 'MonthlyEnergy':
        return rateComponents.map(({ charge, name, }) => ({ charge, name, billingDeterminants: new MonthlyEnergy(loadProfile) }));
      case 'SurchargeAsPercent':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new SurchargeAsPercent(args) }));
      case 'HourlyEnergy':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new HourlyEnergy(args, loadProfile) }));
      case 'DemandTiersInMonths':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new DemandTiersInMonths(args, loadProfile) }));
      case 'DemandTimeOfUse':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new DemandTimeOfUse(args, loadProfile) }));
      case 'DemandPerDay':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new DemandPerDay(args, loadProfile) }));
      case 'DemandPerDayAveraged':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new DemandPerDayAveraged(args, loadProfile) }));
      default:
        throw new Error(`Unknown rateElementType: ${rateElementType}`);
    }
  }
}

export default BillingDeterminantsFactory;
