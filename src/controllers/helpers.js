const getComputedPopulation = location => {
  location.population.computed = location.graph.reduce(
    (population, child) => {
      population.male += child.population.male;
      population.female += child.population.female;
      location.population.total += child.population.total;
      return population;
    },
    { ...location.population }
  );
  return location;
};

exports.computeTotalPopulation = locationArray => {
  return locationArray.map(getComputedPopulation);
};
