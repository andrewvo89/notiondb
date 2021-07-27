import { CompountFilterTypes } from './types';
import { Filter } from '../types';

class CompoundFilter implements Filter {
  #filter1: Filter;
  #type: CompountFilterTypes;
  #filter2: Filter;

  constructor(filter1: Filter, type: CompountFilterTypes, filter2: Filter) {
    this.#filter1 = filter1;
    this.#type = type;
    this.#filter2 = filter2;
  }

  get filter1() {
    return this.#filter1;
  }

  get filter2() {
    return this.#filter2;
  }

  transformToNotionFilter(): Record<string, any> {
    return {
      [this.#type]: [
        this.#filter1.transformToNotionFilter(),
        this.#filter2.transformToNotionFilter(),
      ],
    };
  }
}

export default CompoundFilter;
