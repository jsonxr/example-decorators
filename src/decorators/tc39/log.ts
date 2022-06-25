export type LogDecoratorMeta = {
  name: string;
};
const createLogDecorator =
  <T extends Function>(defaults?: LogDecoratorMeta) =>
  (value: T, context: any) => {
    const { kind } = context;
    const name = defaults?.name ?? context.name;

    // field
    if (kind === 'field') {
      return function (initialValue: any) {
        console.log(`${name}=${JSON.stringify(initialValue)}`);
        return initialValue;
      };
    }

    if (kind === 'class') {
      const clazz: new (...args: any[]) => Object = value as any; // Make typescript happy
      return class extends clazz {
        constructor(...args: any[]) {
          super(...args);
          console.log(`new ${name}(${args.map((a: any) => JSON.stringify(a)).join(', ')})`);
        }
      };
    }

    // method, getter, setter
    if (['method', 'getter', 'setter'].includes(kind)) {
      return function (...args: any) {
        const fnStr = `${name}(${args.map((a: any) => JSON.stringify(a)).join(', ')})`;
        console.log(`${fnStr}`);
        // @ts-ignore (this)
        const ret = value.call(this, ...args);
        if (ret instanceof Promise) {
          return ret.then(v => {
            console.log(`${fnStr} => Promise.resolve(${JSON.stringify(v)})`);
          });
          // .catch(error => {
          //   console.error('ERROR!!! ', fnStr, error);
          //   throw error;
          // });
        } else {
          console.log(`${fnStr} => ${JSON.stringify(ret)}`);
          return ret;
        }
      };
    }

    if (kind === 'class') {
      console.log('class...', name);
    }
  };

export function log(...args: any): any {
  // @table
  if (['function', 'undefined'].includes(typeof args[0])) {
    const value = args[0];
    const context = args[1];
    return createLogDecorator()(value, context);
  }

  if (typeof args[0] === 'string') {
    console.log('returning string...');
    return createLogDecorator({ name: args[0] });
  }

  throw new Error(`@log - oops, invalid application ${typeof args[0]}`);
}
