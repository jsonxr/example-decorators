import { ClassDecoratorContext, ClassFieldDecoratorContext } from './types';

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
  fields: FieldMetadata;
};
export const schemas: Record<string | symbol, TableMetadata> = {};

// -----------------------------------------------------------------------------
// Field
// -----------------------------------------------------------------------------
let FIELDS: Record<string | symbol, FieldMetadata> = {};

const createFieldDecorator = (options?: FieldMetadata) => (_value: undefined, context: ClassFieldDecoratorContext) => {
  if (context.kind === 'field') {
    const name: string | symbol = context.name;
    const field: FieldMetadata = {
      ...options,
      name,
      field: options?.field ?? String(context.name),
    };
    FIELDS[name] = field;
  }
};

// const decorator = (name: string, decoratorFactory: any) => (...args: any): any => {
//   if (args.length < 1 || args.length > 2) {
//     throw new Error(`Improper use of @${name} decorator`);
//   }

//   // @field
//   if (typeof args[0] === 'undefined' && args.length === 2) {
//     return decoratorFactory()(args[0], args[1]); // Pass through, so just use default decorator function
//   }

//   // @field('my-field'), @field('myfield', { type: 'string' })
//   if (['string', 'object'].includes(typeof args[0])) {
//     return decoratorFactory(args[0], args[1]);
//   }

//   // @table({ name: 'myfield', type: 'string' })
//   if (typeof args[0] === 'object' && args.length === 1) {
//     return decoratorFactory(undefined, args[0]);
//   }

//   throw new Error(`Improper use of @${name} decorator`);
// }

export function field(_: unknown, context: any): any; // @field
export function field(name: string, meta?: Omit<FieldMetadata, 'name' | 'field'>): any; // @field('name'), @field('name', { type: "string" })
export function field(meta: Omit<FieldMetadata, 'name'>): any; // @field({ field: 'name', type: 'string' })
export function field(...args: any): any {
  if (args.length < 1 || args.length > 2) {
    throw new Error('Improper use of @field attribute');
  }

  // @field
  if (typeof args[0] === 'undefined' && args.length === 2) {
    return createFieldDecorator()(undefined, args[1]); // Pass through, so just use default decorator function
  }

  // @field('my-field'), @field('myfield', { type: 'string' })
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

  throw new Error('Improper use of @field attribute ' + typeof args[0]);
}

// -----------------------------------------------------------------------------
// Table
// -----------------------------------------------------------------------------

const createTableDecorator =
  <T extends Function>(options?: Omit<TableMetadata, 'name'>) =>
  (_value: T, context: ClassDecoratorContext) => {
    if (context.kind === 'class' && context.name) {
      const table: TableMetadata = {
        ...options,
        name: context.name,
        fields: FIELDS,
        table: options?.table ?? String(context.name),
      };
      schemas[context.name] = table;
      FIELDS = {};
      return;
    }

    throw new Error('Improper use of @table attribute');
  };

type TableDecorator = <T extends Function>(value: T, ...args: any[]) => T | void;
// @table
export function table<T extends Function>(value: T, ...args: any[]): T | void;
// @table('name'), @table('name', { description: "my string" })
export function table<T extends Function>(
  name: string,
  meta?: Omit<TableMetadata, 'name' | 'table' | 'fields'>
): TableDecorator;
export function table<T extends Function>(meta: Omit<TableMetadata, 'name' | 'fields'>): TableDecorator; // @table({ table: '', description: '' })
export function table<T extends Function>(...args: any): TableDecorator | T | void {
  if (args.length < 1 || args.length > 2) {
    throw new Error('Improper use of @field attribute');
  }

  // @table
  if (typeof args[0] !== 'string' && args.length === 2) {
    return createTableDecorator<T>()(args[0], args[1]); // Pass through, so just use default decorator function
  }

  // @field('my-table'), @field('my-table', { description: 'string' })
  if (typeof args[0] === 'string') {
    const meta: Omit<TableMetadata, 'name'> = {
      ...args[1],
      table: args[0],
    };
    return createTableDecorator(meta);
  }

  // @table({ name: 'my-table', description: 'my description' })
  if (typeof args[0] === 'object' && args.length === 1) {
    return createTableDecorator(args[0]);
  }

  throw new Error('Improper use of @table attribute ');
}
