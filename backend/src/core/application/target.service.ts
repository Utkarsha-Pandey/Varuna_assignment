// A simple map of compliance targets
const complianceTargets: { [year: number]: number } = {
  // 91.16 is the 2020 baseline mentioned in the prompt
  2024: 91.16, 
  // 89.3368 is 2% below the 91.16 baseline
  2025: 89.3368, 
};

export class TargetService {
  /**
   * Gets the compliance target intensity for a given year.
   */
  public getTargetIntensity(year: number): number {
    const target = complianceTargets[year];
    if (!target) {
      throw new Error(`Compliance target for year ${year} is not defined.`);
    }
    return target;
  }
}