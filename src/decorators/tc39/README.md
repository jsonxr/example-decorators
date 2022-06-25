# TC39

Decorators implemented using the [TC39 decorator proposal](https://github.com/tc39/proposal-decorators)

# VSCode + Typescript Issues

Due to vscode + typescript's support of (legacy) experimental decorators, there are a few quirks to be aware of.

## Issue #1: Typescript signatures

Due to the built in support for experimental decorators in typescript, vscode tries too hard when you disable them and
use @babel/proposal-decorators.

For this reason, some of the type signatures aren't quite right. Specifically if you wnat to use a decorator without
params, you must use a generic second argument instead of the type safe context.

```js
export function table<T extends Function>(value: T, ...args: any[]): T | void;

@table
export class Example {}
```

## Issue #2: Default export/decorator order

If you don't want annoying errors in your vscode, you must put the export AFTER the decorator. This is not the default
in the babel

```js
module.exports = {
  plugins: [['@babel/plugin-proposal-decorators', { version: '2021-12', decoratorsBeforeExport: true }]],
};
```

```js
@decorator
export class Example {}
```

## Issue #3: ts-ignore required for some decorators

Typescript does not support all the places you can put a decorator, so in these places you must put a `//ts-ignore`
above the decorator to prevent vscode from complaining.

- anything private
- setters (in a getter/setter pair)

```js
function my(...args: any): any {}

class Example {
  // @ts-ignore
  @my
  #prop: string = '';
}
```

## Issue #4: accessor not supported at all

Typescript does not support accessor at all and there is no way to turn off the error squiggle

```js
class Example {
  // No way to turn off the typescript parsing error you get with accessor
  @f('accessor') accessor myBool: boolean = false;
}
```
