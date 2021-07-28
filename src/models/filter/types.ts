/**
 * Mandatory method each Filter has to implement.
 * @interface Filter
 */
interface Filter {
  transformToNotionFilter: () => Record<string, any>;
}

/**
 * Shape of the Filter object send to the Notion API.
 * @interface NotionPropertyFilter
 */
interface NotionPropertyFilter {
  property: string;
  checkbox?: {
    [key: string]: boolean;
  };
  date?: {
    [key: string]: string | boolean | object;
  };
  file?: {
    [key: string]: boolean;
  };
  formula?: Record<string, any>;
  multi_select?: {
    [key: string]: string | boolean;
  };
  number?: {
    [key: string]: number | boolean;
  };
  people?: {
    [key: string]: number | boolean;
  };
  relation?: {
    [key: string]: string | boolean;
  };
  select?: {
    [key: string]: string | boolean;
  };
  text?: {
    [key: string]: string | boolean;
  };
}

type Equals = 'equals';
type DoesNotEqual = 'does_not_equal';
type GreaterThan = 'greater_than';
type LessThan = 'less_than';
type GreatherThanOrEqualTo = 'greater_than_or_equal_to';
type LessThanOrEqualTo = 'less_than_or_equal_to';
type IsEmpty = 'is_empty';
type IsNotEmpty = 'is_not_empty';
type Contains = 'contains';
type DoesNotContain = 'does_not_contain';
type StartsWith = 'starts_with';
type EndsWith = 'ends_with';
type Before = 'before';
type After = 'after';
type OnOrBefore = 'on_or_before';
type OnOrAfter = 'on_or_after';
type PastWeek = 'past_week';
type PastMonth = 'past_month';
type PastYear = 'past_year';
type NextWeek = 'next_week';
type NextMonth = 'next_month';
type NextYear = 'next_year';

export {
  Filter,
  Equals,
  DoesNotEqual,
  GreaterThan,
  LessThan,
  GreatherThanOrEqualTo,
  LessThanOrEqualTo,
  IsEmpty,
  IsNotEmpty,
  Contains,
  DoesNotContain,
  StartsWith,
  EndsWith,
  Before,
  After,
  OnOrBefore,
  OnOrAfter,
  PastWeek,
  PastMonth,
  PastYear,
  NextWeek,
  NextMonth,
  NextYear,
  NotionPropertyFilter,
};
