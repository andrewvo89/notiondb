import {
  DoesNotEqual,
  Equals,
  GreaterThan,
  GreatherThanOrEqualTo,
  IsEmpty,
  IsNotEmpty,
  LessThan,
  LessThanOrEqualTo,
} from '..';

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
