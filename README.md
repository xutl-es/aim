# @xutl/aim

One [eXtremely Useful Tool Library](https://xutl.es) to facilitate using async iterators.

## Install

```bash
npm install --save-dev @xutl/aim
```

## Usage

```typescript
import aim from '@xutl/aim';

const iter : AsyncIterator<T> = getIterator(); // assume you have an AsyncIterator

const cool = aim(iter);

// This can now do one of
await cool.each((item, index)=>console.log(`${index}:`, item));
const mappediterator = cool.map<X>((item: T, index:number):Promise<X>=>convertTtoX(item)); // returns another async iterator that has the mapped values;
const filterediterator = cool.filter((item: T, index:number):Promise<boolean=>test(item)); // returns another async iterator that is filtered by the predicate
await cool.reduce((agg: A, item: T)=>aggregate(agg, item) as A, original: A); // returns the aggregate

// ---
function liveStatistics(AsyncIterator<number> iter) : { count: number, sum: number, average: number } {
    const result = { sum: 0, average: 0, done?:Promise<void> };
    result.done = aim(iter).each((value, index)=>{
        result.sum += value;
        result.average = result.sum / (index+1);
    });
    return result;
}

```

## License

Copyright 2019,2020 xutl.es

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
