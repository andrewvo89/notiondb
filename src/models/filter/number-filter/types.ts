import {
  DoesNotEqual,
  Equals,
  GreaterThan,
  GreatherThanOrEqualTo,
  IsEmpty,
  IsNotEmpty,
  LessThan,
  LessThanOrEqualTo,
} from '../types';

type NumberFilterTypes =
  | Equals
  | DoesNotEqual
  | GreaterThan
  | LessThan
  | GreatherThanOrEqualTo
  | LessThanOrEqualTo
  | IsEmpty
  | IsNotEmpty;

export { NumberFilterTypes };
