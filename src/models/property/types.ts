interface PropertyInterface {
  notionValue: Record<string, any>;
}

interface NewProperty {
  property: string;
  type: PropertyInterface;
}

export { PropertyInterface, NewProperty };
