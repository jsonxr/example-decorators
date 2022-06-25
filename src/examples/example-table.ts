import { table, field, schemas } from '../decorators/tc39.js';

@table
export class Example1 {
  @field one: string = 'a';
  @field('c_two') two: string = 'b';
  @field('c_three', { type: 'string' }) three: string = 'b';
  @field({ field: 'c_four', type: 'string' }) four: string = 'b';
}

@table('e2')
class Example2 {
  @field phone2: string = 'a';
}

@table('e3', { description: 'my description ' })
class Example3 {
  @field phone3: string = 'a';
}

@table({ table: 'e4', description: 'my description ' })
class Example4 {
  @field phone4: string = 'bob';
}

export default () => {
  const e1 = new Example1();
  // const e2 = new Example2();
  // const e3 = new Example3();
  // const e4 = new Example4();
  console.log(e1);
};

console.log(schemas);
