import BillingDeterminant from './billingDeterminants/_BillingDeterminants';
import FixedPerDay from './billingDeterminants/FixedPerDay';
import FixedPerMonth from './billingDeterminants/FixedPerMonth';
import { default as BlockedTiersInDays, BlockedTiersArgs } from './billingDeterminants/BlockedTiersInDays';
import BlockedTiersInMonths from './billingDeterminants/BlockedTiersInMonths';
import { default as EnergyTimeOfUse, EnergyTimeOfUseArgs } from './billingDeterminants/EnergyTimeOfUse';
import LoadProfile from './LoadProfile';
import MonthlyDemand from './billingDeterminants/MonthlyDemand';
import MonthlyEnergy from './billingDeterminants/MonthlyEnergy';
import SurchargeAsPercent, { SurchargeAsPercentArgs } from './billingDeterminants/SurchargeAsPercent';
import HourlyEnergy, { HourlyEnergyArgs } from './billingDeterminants/HourlyEnergy';

export type RateElementType = 'EnergyTimeOfUse' | 'BlockedTiersInDays' | 'BlockedTiersInMonths' | 'FixedPerDay' | 'FixedPerMonth' | 'MonthlyEnergy' | 'MonthlyDemand' | 'SurchargeAsPercent' | 'HourlyEnergy';

export type BillingDeterminantFactoryInterface = EnergyTimeOfUseArgs |
  BlockedTiersArgs |
  SurchargeAsPercentArgs |
  HourlyEnergyArgs |
  {};

class BillingDeterminantFactory {
  static make(
    type: RateElementType,
    { ...args }: BillingDeterminantFactoryInterface,
    loadProfile: LoadProfile,
  ): BillingDeterminant {
    switch (type) {
      case 'EnergyTimeOfUse':
        return new EnergyTimeOfUse(args as EnergyTimeOfUseArgs, loadProfile);
      case 'BlockedTiersInDays':
        return new BlockedTiersInDays(args as BlockedTiersArgs, loadProfile);
      case 'BlockedTiersInMonths':
        return new BlockedTiersInMonths(args as BlockedTiersArgs, loadProfile);
      case 'FixedPerDay':
        return new FixedPerDay();
      case 'FixedPerMonth':
        return new FixedPerMonth();
      case 'MonthlyDemand':
        return new MonthlyDemand(loadProfile);
      case 'MonthlyEnergy':
        return new MonthlyEnergy(loadProfile);
      case 'SurchargeAsPercent':
        return new SurchargeAsPercent(args as SurchargeAsPercentArgs);
      case 'HourlyEnergy':
        return new HourlyEnergy(args as HourlyEnergyArgs, loadProfile);
    }
  }
}

export default BillingDeterminantFactory;
