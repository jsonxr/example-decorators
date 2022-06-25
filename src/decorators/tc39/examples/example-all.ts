function f(key: string, ...args: any): any {
  console.log('evaluate: ', key);

  return function (value: any, ctx: any) {
    //console.log(key, ctx);
    console.log(ctx.kind, ctx.isStatic ? 'static' : '      ', ctx.isPrivate ? 'private' : '       ', ctx.name, value);
  };
}

// Methods (static, instance)...
// Fields (static, instance)...

// @ts-ignore]
@f('Class Decorator')
class App {
  // accessor just can not turn off accessor error
  //@f('accessor') accessor myBool: boolean = false;

  // -----------------------------------
  // field
  // -----------------------------------
  @f('Instance Public Property')
  ipub?: number;

  @f('Static public Property')
  static spub?: number;

  constructor(foo: number) {
    this.ipub = foo;
  }

  // -----------------------------------
  // getter
  // -----------------------------------
  @f('public getter')
  get ipriv2() {
    return this.#ipriv2;
  }

  @f('static public getter')
  static get spriv() {
    return this.#spriv;
  }

  @f('Static public Method')
  static static_public_method(foo: any) {}

  @f('Instance Public Method')
  instance_public_method(foo: any) {}

  // @ts-ignore
  @f('Instance Private Property')
  #ipriv2?: number;

  // @ts-ignore
  @f('Static Private Property')
  static #spriv?: number;

  // @ts-ignore
  @f('public setter')
  set ipriv2(value: any) {
    this.#ipriv2 = value;
  }

  // @ts-ignore
  @f('static setter')
  static set spriv(value: any) {
    this.#spriv = value;
  }

  // @ts-ignore
  @f('Static Private Method')
  static #static_private_method(foo: any) {}

  // @ts-ignore
  @f('Instance Private Method')
  #instance_private_method(foo: any) {}
}

export default () => {
  const a = new App(42);
  console.log(a);
};
