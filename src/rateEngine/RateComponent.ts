import { mean, sum, times } from "lodash-es";
import BillingDeterminants from './billingDeterminants/_BillingDeterminants.ts';
import type { RateComponentArgs } from './types/index.ts';
import { multiplyDecimals } from './utils/decimals.ts';

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

  rateElementClassification() {
    return this._billingDeterminants.rateElementClassification;
  }
}

export default RateComponent;
