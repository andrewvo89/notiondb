import {
  After,
  Before,
  Equals,
  NextMonth,
  NextWeek,
  NextYear,
  OnOrAfter,
  OnOrBefore,
  PastMonth,
  PastWeek,
  PastYear,
} from '..';

type DateFilterTypes =
  | Equals
  | Before
  | After
  | OnOrBefore
  | OnOrAfter
  | PastWeek
  | PastMonth
  | PastYear
  | NextWeek
  | NextMonth
  | NextYear;

export { DateFilterTypes };
