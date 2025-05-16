import LoadProfile from "../../LoadProfile";
import RateCalculator from "../../RateCalculator";
import { RateCalculatorInterface } from "../../types/index";
import { RATES } from "./data";

const dailyLoadProfile = [
  42.0, 42.0, 42.0, 42.0, 42.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 118.0, 118.0, 118.0, 0.0, 0.0, 20.0,
  0.0, 0.0, 42.0, 42.0, 42.0,
];

describe('RateCalculator', () => {
  it('.annualCost', () => {
    expect(dailyLoadProfile.length).toEqual(24);

    const annualLoadProfile = new Array(365).fill(dailyLoadProfile).flat();
    expect(annualLoadProfile.length).toEqual(8760);

    const loadProfile = new LoadProfile(annualLoadProfile, { year: 2025 });

    const rateCalculator = new RateCalculator({ ...RATES.TOU_EV_9, loadProfile } as RateCalculatorInterface);

    const annualEnergyCost = rateCalculator.annualCost();

    expect(annualEnergyCost).toBeCloseTo(73835.2953);
  });
});
