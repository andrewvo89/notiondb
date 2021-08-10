import { PropertyType } from '../../models';

/**
 * Class representing a SchemaObject.
 * @class SchemaObject
 */
class SchemaObject {
  #property: string;
  #type: PropertyType;

  /**
   * Creates an instance of SchemaObject.
   * @param {string} property
   * @param {PropertyType} type
   * @memberof SchemaObject
   */
  constructor(property: string, type: PropertyType) {
    this.#property = property;
    this.#type = type;
  }

  /**
   * Gets the type of the property of this Schema Object.
   * @readonly
   * @type {PropertyType}
   * @memberof SchemaObject
   */
  get type(): PropertyType {
    return this.#type;
  }

  /**
   * Gets a Notion friendly object to create a new Property.
   * @return {*}  {Record<string, Record<string, any>>}
   * @memberof SchemaObject
   */
  transformToNotionProperty(): Record<string, Record<string, {}>> {
    return {
      [this.#property]: {
        [this.#type]: {},
      },
    };
  }
}

export { SchemaObject };
