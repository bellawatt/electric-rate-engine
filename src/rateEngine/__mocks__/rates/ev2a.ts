import { RateElementTypeEnum } from '../../constants/index';
import type { RateInterface } from '../../types/index';

const summerPeakCharge = 0.47861;
const summerPartpeakCharge = 0.36812;
const winterPeakCharge = 0.3515;
const winterPartpeakCharge = 0.3348;
const offpeakCharge = 0.16611;

const ev2a: RateInterface = {
  name: 'EV2-A',
  title: 'Residential Time-Of-Use Service for Plug-In Electric Vehicle Customers',
  rateElements: [
    {
      rateElementType: RateElementTypeEnum.FixedPerDay,
      name: 'Delivery Charge',
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
      name: 'Energy Charges',
      rateElementType: RateElementTypeEnum.EnergyTimeOfUse,
      rateComponents: [
        {
          charge: summerPeakCharge,
          months: [5, 6, 7, 8],
          hourStarts: [16, 17, 18, 19, 20],
          name: 'summer peak',
        },
        {
          charge: winterPeakCharge,
          months: [0, 1, 2, 3, 4, 9, 10, 11],
          hourStarts: [16, 17, 18, 19, 20],
          name: 'winter peak',
        },
        {
          charge: summerPartpeakCharge,
          months: [5, 6, 7, 8],
          hourStarts: [15, 21, 22, 23],
          name: 'summer part peak',
        },
        {
          charge: winterPartpeakCharge,
          months: [0, 1, 2, 3, 4, 9, 10, 11],
          hourStarts: [15, 21, 22, 23],
          name: 'winter part peak',
        },
        {
          charge: offpeakCharge,
          hourStarts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          name: 'offpeak',
        },
      ],
    },
  ],
};

export default ev2a;
