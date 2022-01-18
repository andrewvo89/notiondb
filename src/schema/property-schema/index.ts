import { SchemaObject } from '..';

/**
 * Class representing a PropertySchema.
 * @class PropertySchema
 */
class PropertySchema {
  #schemaObjects: SchemaObject[];

  /**
   * Creates an instance of PropertySchema.
   * @param {SchemaObject[]} schemaObjects
   * @memberof PropertySchema
   */
  constructor(schemaObjects: SchemaObject[]) {
    const hasTitleProperty = schemaObjects.some((schemaObject) => schemaObject.type === 'title');
    if (!hasTitleProperty) {
      schemaObjects.push(new SchemaObject('Name', 'title'));
    }
    this.#schemaObjects = schemaObjects;
  }

  /**
   * Gets a collection of Schema Objects.
   * @readonly
   * @type {SchemaObject[]}
   * @memberof PropertySchema
   */
  get schemaObjects(): SchemaObject[] {
    return this.#schemaObjects;
  }
}

export { PropertySchema };
