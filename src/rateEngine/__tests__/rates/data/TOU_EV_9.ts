import touEV9RateElements from '../../../__mocks__/rates/tou-ev-9.json';

const touEV9 = {
  name: 'TOU-EV-9',
  title: 'Above 500kW.',
  code: 'TOU_EV_9',
  helpText:
    'Applicable to businesses that separately meter the charging of their electric vehicles with charging demands exceeding 500 kW.',

  minKw: 500,
  maxKw: Infinity,

  rateElements: touEV9RateElements,
}

export default touEV9;
