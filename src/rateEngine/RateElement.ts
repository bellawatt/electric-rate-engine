import RateComponent from './RateComponent';
import RateCalculator from './RateCalculator';
import sum from 'lodash.sum';
import ValidatorFactory from './ValidatorFactory';
import LoadProfile from './LoadProfile';
import RateComponentsFactory from './RateComponentsFactory';
import { BillingCategory, RateElementClassification } from './constants';
import type { RateElementType, RateElementInterface, RateElementFilterArgs, ValidatorError } from './types';

class RateElement {
  private _rateComponents: Array<RateComponent>;
  id?: string;
  name: string;
  type: RateElementType;
  classification?: RateElementClassification;
  billingCategory?: BillingCategory;
  errors: Array<ValidatorError> = [];

  constructor(
    rateElementArgs: RateElementInterface,
    loadProfile: LoadProfile,
    otherRateElements: Array<RateElementInterface> = [],
  ) {
    const { id, rateElementType, name, billingCategory } = rateElementArgs;
    this.id = id;
    this.name = name;
    this.type = rateElementType;
    this.billingCategory = billingCategory;

    if (RateCalculator.shouldValidate) {
      const validator = ValidatorFactory.make(
        rateElementType,
        rateElementArgs['rateComponents'] ?? [],
        loadProfile,
      ).validate();

      if (RateCalculator.shouldLogValidationErrors) {
        validator.reportErrors();
      }

      this.errors = validator.allErrors();
    }

    this._rateComponents = RateComponentsFactory.make(rateElementArgs, loadProfile, otherRateElements);

    // Should we be assuming that all components
    // have the same classification?
    this.classification = this._rateComponents[0]?.rateElementClassification();
  }

  rateComponents(): Array<RateComponent> {
    return this._rateComponents;
  }

  annualCost(): number {
    return sum(this.rateComponents().map((component) => component.annualCost()));
  }

  costs(): Array<number> {
    const costs = Array(12).fill(0);

    this.rateComponents().forEach((component) => {
      component.costs().forEach((cost, monthIdx) => {
        costs[monthIdx] += cost;
      });
    });

    return costs;
  }

  matches({ billingCategories, classifications, ids }: RateElementFilterArgs) {
    return (
      (this.billingCategory && billingCategories ? billingCategories.includes(this.billingCategory) : true) &&
      (this.classification && classifications ? classifications.includes(this.classification) : true) &&
      (this.id && ids ? ids.includes(this.id) : true)
    );
  }
}

export default RateElement;
