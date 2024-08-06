import Validator from './validators/_Validator';
import EnergyTimeOfUseValidator from './validators/EnergyTimeOfUseValidator';
import GenericValidator from './validators/GenericValidator';
import BlockedTiersValidator from './validators/BlockedTiersValidator';
import LoadProfile from './LoadProfile';
import { RateComponentInterface, EnergyTimeOfUseArgs, BlockedTiersArgs, RateElementType } from './types';

class ValidatorFactory {
  static make(
    type: RateElementType,
    args: RateComponentInterface[],
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
