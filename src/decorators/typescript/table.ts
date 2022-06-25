import { FieldMetadata, TableMetadata, registry } from './registry.js';

// -----------------------------------------------------------------------------
// Field
// -----------------------------------------------------------------------------
let FIELDS: FieldMetadata[] = [];

const createFieldDecorator = (options?: FieldMetadata) => (target: {}, name: string) => {
  const field: FieldMetadata = {
    name,
    field: options?.field ?? String(name),
    ...options,
  };
  FIELDS.push(field);
};

export function field(target: {}, propertyKey: string): any; // @field
export function field(field: string, meta?: Omit<FieldMetadata, 'name' | 'field'>): any; // @field('field'), @field('field', { type: "string" })
export function field(meta: Omit<FieldMetadata, 'name'>): any; // @field({ field: 'field', type: 'string' })
export function field(...args: any[]): any {
  if (args.length < 1 || args.length > 3) {
    throw new Error(`Improper use of @field: args.length=${args.length} `);
  }

  // @field
  if (typeof args[0] === 'object' && typeof args[1] === 'string' && args.length === 3) {
    return createFieldDecorator()(args[0], args[1]);
  }

  if (typeof args[0] === 'string') {
    const meta: Omit<FieldMetadata, 'name'> = {
      ...args[1],
      field: args[0],
    };
    return createFieldDecorator(meta);
  }

  // @field({ field: 'myfield', type: 'string' })
  if (typeof args[0] === 'object' && args.length === 1) {
    return createFieldDecorator(args[0]);
  }

  console.error(args);
  throw new Error(`Improper use of @field ${typeof args[0]}`);
}

// -----------------------------------------------------------------------------
// Table
// -----------------------------------------------------------------------------

const createTableDecorator =
  (options?: Omit<TableMetadata, 'name'>) =>
  <T extends { new (...args: any[]): {} }>(constructor: T) => {
    const table: TableMetadata = {
      name: constructor.name,
      table: options?.table ?? String(constructor.name),
      fields: FIELDS,
      ...options,
    };
    registry.add(table);
    FIELDS = [];
    return;
  };

export function table(table: string, meta?: Omit<TableMetadata, 'name' | 'table' | 'fields'>): any;
export function table<T extends { new (...args: any[]): {} }>(constructor: T): T;
export function table<T extends Function>(meta: Omit<TableMetadata, 'name' | 'fields'>): any; // @table({ table: '', description: '' })
export function table(...args: any): any {
  if (args.length < 1 || args.length > 2) {
    throw new Error(`Improper use of @table: args.length=${args.length}`);
  }

  // @table
  if (typeof args[0] === 'function' && args.length === 1 && args[0] instanceof Function) {
    return createTableDecorator()(args[0]); // Pass through, so just use default decorator function
  }

  // @field('my-table'), @field('my-table', { description: 'string' })
  if (typeof args[0] === 'string') {
    return createTableDecorator({ table: args[0], ...args[1] });
  }

  // @table({ name: 'my-table', description: 'my description' })
  if (typeof args[0] === 'object' && args.length === 1) {
    return createTableDecorator(args[0]);
  }

  throw new Error(`Improper use of @table: ${typeof args[0]}`);
}
