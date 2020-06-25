import { MapIterator, IteratorMapCallback } from './miter';
import { FilterIterator, IteratorFilterCallback } from './fiter';

export interface IteratorReduceCallback<AGG, ITM> {
	(aggregate: AGG, value: ITM, index: number): AGG | Promise<AGG>;
}

export type IteratorEachCallback<ITM> = IteratorMapCallback<ITM, void>;
export { MapIterator, FilterIterator };

export class Enhanced<T> implements AsyncIterableIterator<T> {
	#iterator: () => AsyncIterator<T>;
	constructor(iter: AsyncIterable<T>) {
		let iterator: AsyncIterator<T>;
		this.#iterator = () => (iterator = iterator ?? iter[Symbol.asyncIterator]());
	}
	[Symbol.asyncIterator]() {
		return this;
	}
	next() {
		return this.#iterator().next();
	}
	return(value?: any) {
		const iter = this.#iterator();
		if (iter.return) return iter.return(value);
		return Promise.resolve({ done: true, value: value ?? null });
	}
	throw(error?: any) {
		const iter = this.#iterator();
		if (iter.return) return iter.return(error);
		return Promise.reject(error);
	}
	async forEach(fn: IteratorEachCallback<T>, thisp: object = this) {
		let index = 0;
		for await (const record of this) {
			fn.call(thisp, record, index);
			index += 1;
		}
	}
	filter(fn: IteratorFilterCallback<T>, thisp: object = this) {
		return new Enhanced<T>(
			new FilterIterator<T>(this.#iterator(), (value: T, index: number) => fn.call(thisp, value, index)),
		);
	}
	map<M>(fn: IteratorMapCallback<T, M>, thisp: object = this) {
		return new Enhanced<M>(
			new MapIterator<T, M>(this.#iterator(), (value: T, index: number) => fn.call(thisp, value, index)),
		);
	}
	async reduce<AGG>(fn: IteratorReduceCallback<AGG, T>, start: AGG, thisp: object = this): Promise<AGG> {
		let result: AGG = start;
		let index = 0;
		for await (let item of this) {
			result = await fn.call(thisp, result, item, index++);
		}
		return result;
	}
	async array<T>(): Promise<T[]> {
		const result: T[] = [];
		for await (let item of this) result.push(item);
		return result;
	}
}
