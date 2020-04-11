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
  switch (periodType) {
    case 'days':
      return 2 * Math.trunc((timeToElapse / 3));
    case 'weeks':
      return 2 * Math.trunc((timeToElapse * 7) / 3);
    case 'months':
      return 2 * Math.trunc((timeToElapse * 30) / 3);
    default:
      return null;
  }
};

const covid19ImpactEstimator = (data) => {
  const inputData = data;
  // Impact variables declaration
  const impactCurrentlyInfected = currentlyInfectedPeople(inputData.reportedCases, 0);
  const impactInfectionsByRequestedTime = impactCurrentlyInfected
    * sortDaysCalculation(inputData.periodType, inputData.timeToElapse);
  const impactSevereCasesByRequestedTime = (15 / 100) * impactInfectionsByRequestedTime;
  const impactHospitalBedsByRequestedTime = Math.trunc(
    ((35 / 100) * inputData.totalHospitalBeds) - impactSevereCasesByRequestedTime
  );

  // Severe Impact variable declarations
  const severeImpactCurrentlyInfected = currentlyInfectedPeople(data.reportedCases, 1);
  const severeImpactInfectionsByRequestedTime = severeImpactCurrentlyInfected
    * sortDaysCalculation(inputData.periodType, inputData.timeToElapse);
  const severeImpactSevereCasesByRequestedTime = (15 / 100) * severeImpactInfectionsByRequestedTime;
  const severeImpactHospitalBedsByRequestedTime = Math.trunc(
    ((35 / 100) * inputData.totalHospitalBeds) - severeImpactSevereCasesByRequestedTime
  );

  return {
    data: inputData,
    impact: {
      currentlyInfected: impactCurrentlyInfected,
      infectionsByRequestedTime: impactInfectionsByRequestedTime,
      severeCasesByRequestedTime: impactSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: impactHospitalBedsByRequestedTime
    },
    severeImpact: {
      currentlyInfected: severeImpactCurrentlyInfected,
      infectionsByRequestedTime: severeImpactInfectionsByRequestedTime,
      severeCasesByRequestedTime: severeImpactSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: severeImpactHospitalBedsByRequestedTime
    }
  };
};

export default covid19ImpactEstimator;
