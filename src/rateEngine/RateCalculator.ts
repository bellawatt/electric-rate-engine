import RateElement, { RateElementInterface, RateElementFilterArgs } from './RateElement';
import LoadProfile from './LoadProfile';

import sum from 'lodash/sum';

export interface RateCalculatorInterface {
  name: string;
  utilityName?: string;
  applicability?: string;
  minimumBillAmount?: number;
  rateElements: Array<RateElementInterface>;
  loadProfile: LoadProfile;
}

class RateCalculator {
  private _rateElements: Array<RateElement>;
  utilityName: string | undefined;
  applicability: string | undefined;
  minimumBillAmount: number | undefined;
  static shouldValidate: Boolean = true;
  static shouldLogValidationErrors: Boolean = true;

  constructor({ name, utilityName, applicability, minimumBillAmount, rateElements, loadProfile }: RateCalculatorInterface) {
    this.utilityName = utilityName;
    this.applicability = applicability;
    this.minimumBillAmount = minimumBillAmount;
    this._rateElements = rateElements.map((element, idx): RateElement => {
      return new RateElement(
        element,
        loadProfile,
        rateElements.filter((_, i) => i !== idx)
      );
    });
  }

  rateElements({...filters}: RateElementFilterArgs = {}): Array<RateElement> {
    return this._rateElements.filter((element) => element.matches(filters));
  }

  annualCost({...filters}: RateElementFilterArgs = {}): number {
    return sum(this.rateElements(filters).map((element) => element.annualCost()));
  }
}

export default RateCalculator;
