import RateElement from '../RateElement';
import { BillingDeterminantsUnits, RateElementClassification, RateElementTypeEnum } from '../constants';
import type { SurchargeAsPercentArgs } from '../types';
import BillingDeterminants from './_BillingDeterminants';

class SurchargeAsPercent extends BillingDeterminants {
  private _rateElement: RateElement;

  rateElementType = RateElementTypeEnum.SurchargeAsPercent;
  rateElementClassification = RateElementClassification.SURCHARGE;
  units = BillingDeterminantsUnits.DOLLARS;

  constructor({rateElement}: SurchargeAsPercentArgs) {
    super();

    this._rateElement = rateElement;
  }

  calculate(): Array<number> {
    return this._rateElement.costs();
  }
}

export default SurchargeAsPercent;
