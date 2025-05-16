import { times } from "lodash";
import type { RateInterface } from '../../types/index';
import { RateElementTypeEnum } from "../../constants";

const SUMMMER_MONTHS = [4, 5, 6, 7, 8, 9];
const cutoff_1 = times(12, (i) => (SUMMMER_MONTHS.includes(i) ? 13 : 12.5));
const cutoff_2 = times(12, (i) => (SUMMMER_MONTHS.includes(i) ? 52 : 50));

const e1: RateInterface = {
  name: 'E-1',
  title: 'Residential Services',
  rateElements: [
    {
      name: 'Delivery Charge',
      rateElementType: RateElementTypeEnum.FixedPerDay,
      rateComponents: [
        {
          charge: 0.32854,
          name: 'Delivery Charge',
        },
      ],
    },
    {
      name: 'California Clean Climate Credit',
      rateElementType: RateElementTypeEnum.FixedPerMonth,
      rateComponents: [
        {
          charge: [0, 0, 0, -35.73, 0, 0, 0, 0, 0, -35.73, 0, 0],
          name: 'California Clean Climate Credit',
        },
      ],
    },
    {
      name: 'Total Energy Rates',
      rateElementType: RateElementTypeEnum.BlockedTiersInDays,
      rateComponents: [
        {
          charge: 0.24373,
          min: times(12, (_) => 0),
          max: cutoff_1,
          name: 'Tier 1',
        },
        {
          charge: 0.30672,
          min: cutoff_1,
          max: cutoff_2,
          name: 'Tier 2',
        },
        {
          charge: 0.53738,
          min: cutoff_2,
          max: times(12, (_) => Infinity),
          name: 'Tier 3',
        },
      ],
    },
  ],
};

export default e1;
