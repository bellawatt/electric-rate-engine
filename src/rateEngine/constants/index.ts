export enum RateElementClassification {
  ENERGY = 'energy',
  DEMAND = 'demand',
  FIXED = 'fixed',
  SURCHARGE = 'surcharge',
};

export enum BillingCategory {
  TAX = 'tax',
  SUPPLY = 'supply',
  DELIVERY = 'delivery',
}

export enum BillingDeterminantsUnits {
  KWH = 'kWh',
  KW = 'kW',
  DAYS = 'days',
  MONTHS = 'months',
  DOLLARS = 'dollars',
}

export * from "./rateElements"