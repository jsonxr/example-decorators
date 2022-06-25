// export type Kind = 'class' | 'method' | 'getter' | 'setter' | 'field' | 'accessor';

// export type Decorator = <T extends any>(
//   value: T,
//   context: {
//     kind: Kind;
//     name: string | symbol;
//     access: {
//       get?(): unknown;
//       set?(value: unknown): void;
//     };
//     private?: boolean;
//     static?: boolean;
//     addInitializer?(initializer: () => void): void;
//   }
// ) => T | void;

export type ClassDecoratorContext = {
  kind: 'class';
  name: string | undefined;
  addInitializer(initializer: () => void): void;
};
export type ClassDecorator = <T extends Function>(value: T, context: ClassDecoratorContext) => T | void | undefined;

export type ClassMethodDecoratorContext = {
  kind: 'method';
  name: string | symbol;
  access: { get(): unknown };
  static: boolean;
  private: boolean;
  addInitializer(initializer: () => void): void;
};
export type ClassMethodDecorator = (value: Function, context: ClassMethodDecoratorContext) => Function | void;

export type ClassGetterDecoratorContext = {
  kind: 'getter';
  name: string | symbol;
  access: { get(): unknown };
  static: boolean;
  private: boolean;
  addInitializer(initializer: () => void): void;
};
export type ClassGetterDecorator = (value: Function, context: ClassGetterDecoratorContext) => Function | void;

export type ClassSetterDecoratorContext = {
  kind: 'setter';
  name: string | symbol;
  access: { set(value: unknown): void };
  static: boolean;
  private: boolean;
  addInitializer(initializer: () => void): void;
};
export type ClassSetterDecorator = (value: Function, context: ClassSetterDecoratorContext) => Function | void;

export type ClassFieldDecoratorContext = {
  kind: 'field';
  name: string | symbol;
  access: { get(): unknown; set(value: unknown): void };
  static: boolean;
  private: boolean;
};
export type ClassFieldDecorator = (
  value: undefined,
  context: ClassFieldDecoratorContext
) => (initialValue: unknown) => unknown | void;

export type Decorator =
  | ClassDecorator
  | ClassMethodDecorator
  | ClassGetterDecorator
  | ClassSetterDecorator
  | ClassFieldDecorator;
