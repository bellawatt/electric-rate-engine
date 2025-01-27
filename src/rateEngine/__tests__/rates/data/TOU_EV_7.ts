import touEV7RateElements from '../../../__mocks__/rates/tou-ev-7.json';

// https://www.sce.com/business/rates/electric-car-business-rates/business/rates/electric-car-business-rates
// https://www.sce.com/sites/default/files/inline-files/TOU-EV-7_8_9%20Rate%20Fact%20Sheet_WCAG%20(2).pdf
// https://edisonintl.sharepoint.com/teams/Public/TM2/Shared%20Documents/Forms/AllItems.aspx?id=%2Fteams%2FPublic%2FTM2%2FShared%20Documents%2FPublic%2FRegulatory%2FTariff%2DSCE%20Tariff%20Books%2FElectric%2FSchedules%2FGeneral%20Service%20%26%20Industrial%20Rates&p=true&ga=1
//
// Service under this Schedule will be supplied at one standard voltage.
const touEV7 = {
  name: 'TOU-EV-7',
  title: '20kW or Less.',
  code: 'TOU_EV_7',
  helpText:
    'Applicable to businesses that separately meter the charging of their electric vehicles with charging demands of 20 kilowatts (kW) or less.',

  minKw: 0,
  maxKw: 20,

  rateElements: touEV7RateElements,
};

// * NOTE: EV-7 rates are the same for each year and have 0 demand charges

export default touEV7;
