import { SchemaObjectTypes } from './types';

/**
 * Class representing a SchemaObject.
 * @class SchemaObject
 */
class SchemaObject {
  #property: string;
  #type: SchemaObjectTypes;

  /**
   * Creates an instance of SchemaObject.
   * @param {string} property
   * @param {SchemaObjectTypes} type
   * @memberof SchemaObject
   */
  constructor(property: string, type: SchemaObjectTypes) {
    this.#property = property;
    this.#type = type;
  }

  /**
   * Gets the type of the property of this Schema Object.
   * @readonly
   * @type {SchemaObjectTypes}
   * @memberof SchemaObject
   */
  get type(): SchemaObjectTypes {
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

export default SchemaObject;
