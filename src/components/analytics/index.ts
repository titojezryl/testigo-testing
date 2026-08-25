export { AnalyticsEventTable } from './analytics-event-table';
export { WebAnalytics } from './WebAnalytics';
export type {
  WebAnalyticsProps,
  WebAnalyticsChartPoint,
  PageStat,
  DateRange,
  Environment,
} from './WebAnalytics';

/**
 * @deprecated Use MetricCardProps instead
 */
export type WebAnalyticsMetric = {
  value: number;
  label: string;
};

/**
 * @deprecated Use PageStat instead
 */
export type ReferrerStat = {
  path: string;
  count: number;
};
