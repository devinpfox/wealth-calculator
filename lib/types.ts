/**
 * Type definitions for the investment comparison tool
 */

export interface DataPoint {
  date: string; // ISO format: YYYY-MM-DD
  price: number; // USD value
}

export interface NormalizedDataPoint extends DataPoint {
  normalizedIndex: number; // Base 100 at start date
  realValue?: number; // Inflation-adjusted value
}

export interface AssetData {
  gold: DataPoint[];
  stocks: DataPoint[];
  silver: DataPoint[];
  cpi: DataPoint[];
}

export type AssetType = 'gold' | 'stocks' | 'silver';

export interface UserInput {
  name?: string;
  investmentAmount: number;
  startYear: number;
  selectedAssets: AssetType[];
  adjustForInflation: boolean;
}

export interface AssetPerformance {
  asset: AssetType;
  startValue: number;
  endValue: number;
  totalReturn: number; // Percentage
  cagr: number; // Percentage
  volatility: number; // Annualized standard deviation
  maxDrawdown: number; // Percentage
}

export interface ProjectionScenario {
  conservative: number;
  average: number;
  optimistic: number;
}

export interface AssetProjection {
  asset: AssetType;
  currentValue: number;
  fiveYear: ProjectionScenario;
  historicalCAGR: number;
  historicalVolatility: number;
}

export interface ChartDataPoint {
  date: string;
  stocks?: number;
  gold?: number;
  silver?: number;
  stocksProjectionLow?: number;
  stocksProjectionAvg?: number;
  stocksProjectionHigh?: number;
  goldProjectionLow?: number;
  goldProjectionAvg?: number;
  goldProjectionHigh?: number;
  silverProjectionLow?: number;
  silverProjectionAvg?: number;
  silverProjectionHigh?: number;
}

export interface ComparisonResult {
  userInput: UserInput;
  performance: AssetPerformance[];
  projections: AssetProjection[];
  chartData: ChartDataPoint[];
  metadata: {
    startDate: string;
    endDate: string;
    yearsInvested: number;
  };
}
