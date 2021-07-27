import {
  Contains,
  DoesNotContain,
  DoesNotEqual,
  EndsWith,
  Equals,
  IsEmpty,
  IsNotEmpty,
  StartsWith,
} from '../types';

type TextFilterTypes =
  | Equals
  | DoesNotEqual
  | Contains
  | DoesNotContain
  | StartsWith
  | EndsWith
  | IsEmpty
  | IsNotEmpty;

export { TextFilterTypes };
