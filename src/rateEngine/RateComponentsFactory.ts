import BillingDeterminantsFactory from './BillingDeterminantsFactory';
import { RateElementTypeEnum } from './constants';
import LoadProfile from './LoadProfile';
import PriceProfile from './PriceProfile';
import RateComponent from './RateComponent';
import RateElement from './RateElement';
import type { RateElementInterface, ProcessedRateElementInterface } from './types';

export default class RateComponentsFactory {
  static make(
    rateElement: RateElementInterface,
    loadProfile: LoadProfile,
    otherRateElements: Array<RateElementInterface>,
  ): Array<RateComponent> {
    const convertedRateElement = this.preprocess(rateElement, loadProfile, otherRateElements);
    const billingDeterminantsSet = BillingDeterminantsFactory.make(convertedRateElement, loadProfile);
    return billingDeterminantsSet.map(({ charge, name, billingDeterminants }) => {
      return new RateComponent({ charge, name, billingDeterminants });
    });
  }

  static preprocess(
    rateElement: RateElementInterface,
    loadProfile: LoadProfile,
    otherRateElements: Array<RateElementInterface>,
  ): ProcessedRateElementInterface {
    switch (rateElement.rateElementType) {
      case RateElementTypeEnum.SurchargeAsPercent: {
        const rateComponents = rateElement.rateComponents.flatMap(
          ({ name: rateComponentName, charge, ...filterArgs }) => {
            return otherRateElements
              .map((element) => new RateElement(element, loadProfile, []))
              .filter((element) => element.matches(filterArgs))
              .map((element) => {
                return {
                  charge,
                  name: `${rateComponentName} surcharge - ${element.name}`,
                  rateElement: element,
                };
              });
          },
        );
        return {
          ...rateElement,
          rateComponents,
        };
      }
      case RateElementTypeEnum.HourlyEnergy: {
        const priceProfile = new PriceProfile(rateElement.priceProfile, { year: loadProfile.year });
        return {
          ...rateElement,
          rateComponents: priceProfile.expanded().map(({ price: charge, hourOfYear }) => ({
            charge,
            name: `${rateElement.name} - Hour ${hourOfYear}`,
            hourOfYear,
          })),
        };
      }
      default: {
        return rateElement;
      }
    }
  }
}
