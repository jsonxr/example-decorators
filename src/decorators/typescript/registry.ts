// -----------------------------------------------------------------------------
// Schema Definitions
// -----------------------------------------------------------------------------

export type FieldMetadata = {
  name?: string | symbol;
  field?: string;
  type?: string;
};
export type TableMetadata = {
  name: string | symbol;
  table: string;
  description?: string;
  fields: FieldMetadata[];
};

class Registry {
  #schemas: TableMetadata[] = [];

  add(schema: TableMetadata) {
    // TODO: Validate no duplicate fields
    // TODO: Validate no duplicate schemas
    this.#schemas.push(schema);
  }

  get(name: string) {
    return this.#schemas.find(s => s.name === name);
  }

  // for (const schema of schemas)
  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => ({
        done: i >= this.#schemas.length,
        value: this.#schemas[i++],
      }),
    };
  }
}

export const registry = new Registry();
