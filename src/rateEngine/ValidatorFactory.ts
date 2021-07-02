import { RateElementType, BillingDeterminantFactoryInterface } from './BillingDeterminantFactory';
import Validator from './validators/_Validator';
import EnergyTimeOfUseValidator from './validators/EnergyTimeOfUseValidator';
import GenericValidator from './validators/GenericValidator';
import { EnergyTimeOfUseArgs } from './billingDeterminants/EnergyTimeOfUse';
import BlockedTiersValidator from './validators/BlockedTiersValidator';
import { BlockedTiersArgs } from './billingDeterminants/BlockedTiersInDays';
import LoadProfile from './LoadProfile';
import { RateComponentInterface } from './RateComponent';

class ValidatorFactory {
  static make(
    type: RateElementType,
    args: Array<BillingDeterminantFactoryInterface>,
    loadProfile: LoadProfile
  ): Validator {
    switch(type) {
      case 'EnergyTimeOfUse':
        return new EnergyTimeOfUseValidator(args as Array<RateComponentInterface & EnergyTimeOfUseArgs>, loadProfile);
      case 'BlockedTiersInDays':
      case 'BlockedTiersInMonths':
        return new BlockedTiersValidator(args as Array<BlockedTiersArgs>, loadProfile);
      default:
        return new GenericValidator();
    }
  }
}

export default ValidatorFactory;
