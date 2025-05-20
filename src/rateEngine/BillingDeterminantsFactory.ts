import BlockedTiersInDays from './billingDeterminants/BlockedTiersInDays';
import BlockedTiersInMonths from './billingDeterminants/BlockedTiersInMonths';
import Demand from './billingDeterminants/Demand';
import EnergyTimeOfUse from './billingDeterminants/EnergyTimeOfUse';
import FixedPerDay from './billingDeterminants/FixedPerDay';
import FixedPerMonth from './billingDeterminants/FixedPerMonth';
import HourlyEnergy from './billingDeterminants/HourlyEnergy';
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
      case 'Demand':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new Demand(args, loadProfile) }));
      case 'MonthlyEnergy':
        return rateComponents.map(({ charge, name, }) => ({ charge, name, billingDeterminants: new MonthlyEnergy(loadProfile) }));
      case 'SurchargeAsPercent':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new SurchargeAsPercent(args) }));
      case 'HourlyEnergy':
        return rateComponents.map(({ charge, name, ...args }) => ({ charge, name, billingDeterminants: new HourlyEnergy(args, loadProfile) }));
      default:
        throw new Error(`Unknown rateElementType: ${rateElementType}`);
    }
  }
}

export default BillingDeterminantsFactory;
