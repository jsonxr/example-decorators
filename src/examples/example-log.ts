import { log } from '../decorators/tc39.js';

@log
class Example {
  @log('Example->proppy')
  prop: string = 'hi';

  @log('Example->m1')
  m1(value: string) {
    return `Hello ${value}`;
  }

  @log('Example->m2')
  async m2(...args: any) {
    return Promise.resolve('hello');
  }

  @log('Example->m3')
  async m3(...args: any) {
    throw new Error('help');
  }

  constructor(value: number) {}
}

export default async () => {
  const e1 = new Example(1);

  const v1 = e1.m1('World');
  e1.prop = 'jason';
  console.log('v1:', v1, '\n\n');

  const v2 = e1.m2(1, 2);
  console.log('v2:', v2, '\n\n');

  const v3 = e1.m3(1, 2);
  console.log('v3:', v3, '\n\n');
};
