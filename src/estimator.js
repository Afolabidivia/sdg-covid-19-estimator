/* The second argument (reportedType) of this function is to determine
    whether it is impact or severe impact
    reportedType can only be 0 or 1 which is impact and severe impact respectively
* */
const currentlyInfectedPeople = (reportedCases, reportedType) => {
  let infectedPeople;
  if (reportedType === 0) {
    infectedPeople = reportedCases * 10;
  } else if (reportedType === 1) {
    infectedPeople = reportedCases * 50;
  }
  return infectedPeople;
};

const sortDaysCalculation = (periodType, timeToElapse) => {
  const formattedPeriodType = periodType.toLowerCase();
  switch (formattedPeriodType) {
    case 'days':
      return timeToElapse;
    case 'weeks':
      return timeToElapse * 7;
    case 'months':
      return timeToElapse * 30;
    default:
      return null;
  }
};

// const sortDaysCalculationForInfection = (periodType, timeToElapse) => {
//   const formattedPeriodType = periodType.toLowerCase();
//   switch (formattedPeriodType) {
//     case 'days':
//       return 2 ** Math.trunc((timeToElapse / 3));
//     case 'weeks':
//       return 2 ** Math.trunc((timeToElapse * 7) / 3);
//     case 'months':
//       return 2 ** Math.trunc((timeToElapse * 30) / 3);
//     default:
//       return null;
//   }
// };

const covid19ImpactEstimator = (data) => {
  const inputData = data;
  // Impact variables declaration
  const impactCurrentlyInfected = currentlyInfectedPeople(inputData.reportedCases, 0);
  const impactInfectionsByRequestedTime = impactCurrentlyInfected
    * (2 ** Math.trunc(sortDaysCalculation(inputData.periodType, inputData.timeToElapse) / 3));
  const impactSevereCasesByRequestedTime = (15 / 100) * impactInfectionsByRequestedTime;
  const impactHospitalBedsByRequestedTime = Math.trunc(
    ((35 / 100) * inputData.totalHospitalBeds) - impactSevereCasesByRequestedTime
  );
  const impactCasesForICUByRequestedTime = Math.trunc(
    (5 / 100) * impactInfectionsByRequestedTime
  );
  const impactCasesForVentilatorsByRequestedTime = Math.trunc(
    (2 / 100) * impactInfectionsByRequestedTime
  );
  const impactDollarsInFlight = (
    (impactInfectionsByRequestedTime * inputData.region.avgDailyIncomePopulation)
    * inputData.region.avgDailyIncomeInUSD
    * sortDaysCalculation(inputData.periodType, inputData.timeToElapse)
  );

  // Severe Impact variable declarations
  const severeImpactCurrentlyInfected = currentlyInfectedPeople(data.reportedCases, 1);
  const severeImpactInfectionsByRequestedTime = severeImpactCurrentlyInfected
    * (2 ** Math.trunc(sortDaysCalculation(inputData.periodType, inputData.timeToElapse) / 3));
  const severeImpactSevereCasesByRequestedTime = (15 / 100) * severeImpactInfectionsByRequestedTime;
  const severeImpactHospitalBedsByRequestedTime = Math.trunc(
    ((35 / 100) * inputData.totalHospitalBeds) - severeImpactSevereCasesByRequestedTime
  );
  const severeImpactCasesForICUByRequestedTime = Math.trunc(
    (5 / 100) * severeImpactInfectionsByRequestedTime
  );
  const severeImpactCasesForVentilatorsByRequestedTime = Math.trunc(
    (2 / 100) * severeImpactInfectionsByRequestedTime
  );
  const severeImpactDollarsInFlight = (
    (severeImpactInfectionsByRequestedTime * inputData.region.avgDailyIncomePopulation)
    * inputData.region.avgDailyIncomeInUSD
    * sortDaysCalculation(inputData.periodType, inputData.timeToElapse)
  );

  return {
    data: inputData,
    impact: {
      currentlyInfected: impactCurrentlyInfected,
      infectionsByRequestedTime: impactInfectionsByRequestedTime,
      severeCasesByRequestedTime: impactSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: impactHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: impactCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: impactCasesForVentilatorsByRequestedTime,
      dollarsInFlight: impactDollarsInFlight
    },
    severeImpact: {
      currentlyInfected: severeImpactCurrentlyInfected,
      infectionsByRequestedTime: severeImpactInfectionsByRequestedTime,
      severeCasesByRequestedTime: severeImpactSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: severeImpactHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: severeImpactCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: severeImpactCasesForVentilatorsByRequestedTime,
      dollarsInFlight: severeImpactDollarsInFlight
    }
  };
};

export default covid19ImpactEstimator;
