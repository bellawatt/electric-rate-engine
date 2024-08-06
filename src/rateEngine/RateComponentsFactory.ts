import RateComponent from './RateComponent';
import AnnualDemand from './billingDeterminants/AnnualDemand';
import BlockedTiersInDays from './billingDeterminants/BlockedTiersInDays';
import BlockedTiersInMonths from './billingDeterminants/BlockedTiersInMonths';
import DemandPerDay from './billingDeterminants/DemandPerDay';
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
import PriceProfile from './PriceProfile';
import RateElement from './RateElement';
import type { RateElementInterface } from './types';

export default class RateComponentsFactory {
  static make(
    rateElement: RateElementInterface,
    loadProfile: LoadProfile,
    otherRateElements: RateElementInterface[],
  ): RateComponent[] {
    const { rateElementType, rateComponents, name } = rateElement;
    switch (rateElementType) {
      case 'SurchargeAsPercent':
        return rateComponents.map(({ name: rateComponentName, charge, ...filterArgs }) => {
          return otherRateElements
            .filter((element: RateElementInterface) => (
              new RateElement(element, loadProfile, []).matches(filterArgs)
            ))
            .map((element: RateElementInterface) => {
              return new RateComponent({
                charge,
                name: `${rateComponentName} surcharge - ${element.name}`,
                billingDeterminants: new SurchargeAsPercent({
                  rateElement: new RateElement(element, loadProfile, []),
                }),
              });
            });
        }).flat();
      case 'HourlyEnergy':
        const priceProfile = new PriceProfile(rateElement.priceProfile, {year: loadProfile.year})
        return priceProfile.expanded().map(({price, hourOfYear}) => {
          return new RateComponent({
            charge: price,
            name: `${name} - Hour ${hourOfYear}`,
            billingDeterminants: new HourlyEnergy({ hourOfYear }, loadProfile),
          });
        });
      case 'EnergyTimeOfUse':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new EnergyTimeOfUse(rest, loadProfile);
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'BlockedTiersInDays':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new BlockedTiersInDays(rest, loadProfile);
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'BlockedTiersInMonths':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new BlockedTiersInMonths(rest, loadProfile);
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'FixedPerDay':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new FixedPerDay();
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'FixedPerMonth':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new FixedPerMonth();
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'MonthlyDemand':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new MonthlyDemand(loadProfile);
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'AnnualDemand':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new AnnualDemand(loadProfile);
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'MonthlyEnergy':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new MonthlyEnergy(loadProfile);
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'DemandTiersInMonths':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new DemandTiersInMonths(rest, loadProfile);
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'DemandTimeOfUse':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new DemandTimeOfUse(rest, loadProfile);
          return new RateComponent({ charge, name, billingDeterminants });
        });
      case 'DemandPerDay':
        return rateComponents.map(({ charge, name, ...rest }) => {
          const billingDeterminants = new DemandPerDay(rest, loadProfile);
          return new RateComponent({ charge, name, billingDeterminants });
        });
      default:
        throw new Error(`Unknown rateElementType: ${rateElementType}`);
    }
  }
}
