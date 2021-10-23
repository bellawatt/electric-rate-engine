import times from 'lodash/times';
import mean from 'lodash/mean';
import sum from 'lodash/sum';
import BillingDeterminants from './billingDeterminants/_BillingDeterminants';
import { multiplyDecimals } from './utils/decimals';
import BillingDeterminantFactoryInterface from './BillingDeterminantFactory';
import { RateElementFilterArgs } from './RateElement';

interface RateComponentArgs {
  charge: number | Array<number>;
  name: string;
  billingDeterminants: BillingDeterminants;
}

export type RateComponentInterface = BillingDeterminantFactoryInterface &
  RateElementFilterArgs & {
  charge: number | Array<number>;
  name: string;
};

const MONTHS_PER_YEAR = 12;

class RateComponent {
  charge: Array<number>;
  name: string;
  private _billingDeterminants: BillingDeterminants;

  constructor({ charge, name, billingDeterminants }: RateComponentArgs) {
    this.charge = typeof charge === 'number' ? times(MONTHS_PER_YEAR, () => charge) : charge;
    this.name = name;
    this._billingDeterminants = billingDeterminants;
  }

  costs(): Array<number> {
    return this._billingDeterminants.map((determinant, idx) => multiplyDecimals(determinant, this.charge[idx]));
  }

  billingDeterminants(): Array<number> {
    return this._billingDeterminants.all();
  }

  typicalMonthlyCost(): number {
    return mean(this.costs());
  }

  costForMonth(month: number): number {
    return this.costs()[month];
  }

  typicalBillingDeterminant(): number {
    return this._billingDeterminants.mean();
  }

  billingDeterminantsForMonth(month: number): number {
    return this.billingDeterminants()[month];
  }

  annualCost(): number {
    return sum(this.costs());
  }
}

export default RateComponent;
