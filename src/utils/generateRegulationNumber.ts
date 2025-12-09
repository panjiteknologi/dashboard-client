/**
 * Generate regulation number based on the last regulation number
 * Format: REG-001, REG-002, etc.
 */
export function generateRegulationNumber(lastNumber?: string): string {
  if (!lastNumber) {
    return "REG-001";
  }

  const match = lastNumber.match(/REG-(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    const nextNum = num + 1;
    return `REG-${nextNum.toString().padStart(3, "0")}`;
  }

  return "REG-001";
}

