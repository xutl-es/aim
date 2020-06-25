import { Enhanced } from './enhanced';
import { Asynchronized } from './asynchronized';

function unify<T>(
	iter: Iterable<T> | IterableIterator<T> | AsyncIterable<T> | AsyncIterableIterator<T> | AsyncIterator<T>,
	delay: number,
): AsyncIterable<T> {
	if (Symbol.iterator in iter) {
		iter = new Asynchronized((iter as Iterable<T>)[Symbol.iterator](), delay);
	}
	if (!(Symbol.asyncIterator in iter)) {
		return Object.create(iter, {
			[Symbol.asyncIterator]: {
				value: function () {
					return this;
				},
				writable: true,
				configurable: true,
			},
		});
	}
	return iter as AsyncIterable<T>;
}

export default function <T>(
	iter: Iterable<T> | IterableIterator<T> | AsyncIterable<T> | AsyncIterableIterator<T> | AsyncIterator<T>,
	delay: number = 0,
): Enhanced<T> {
	return new Enhanced(unify(iter, delay));
}
