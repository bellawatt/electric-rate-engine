import touEV8RateElements from '../../../__mocks__/rates/tou-ev-8.json';

const touEV8 = {
  name: 'TOU-EV-8',
  code: 'TOU_EV_8',
  helpText:
    'Applicable to businesses that separately meter the charging of their electric vehicles with charging demands above 20 kilowatts (kW) and less than 500kW.',
  title: 'Above 20kW and up to 500kW.',

  minKw: 20,
  maxKw: 500,

  rateElements: touEV8RateElements,
}

export default touEV8;
