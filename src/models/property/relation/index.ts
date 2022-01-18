import { PropertyInterface } from '..';
import { RelationNotionValue } from '.';

/**
 * Class representing a Relation Notion type.
 * @class Relation
 * @implements {PropertyInterface}
 */
class Relation implements PropertyInterface {
  #values: string[];

  /**
   * Creates an instance of Relation.
   * @param {string} value
   * @memberof Relation
   */
  constructor(values: string[]) {
    this.#values = values;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {RelationNotionValue}
   * @memberof Relation
   */
  get notionValue(): RelationNotionValue {
    return {
      relation: this.#values.map((value) => ({ id: value })),
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {RelationNotionValue} notionValue
   * @return {*}  {string}
   * @memberof Relation
   */
  static getValue(notionValue: RelationNotionValue): string[] {
    return notionValue.relation.map((value) => value.id);
  }
}

export { Relation };
export * from './types';
