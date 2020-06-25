import { describe, it } from '@xutl/test';
import assert from 'assert';

import AIM from '../';

const data = [1, 2, 3, 4, 5];

describe('AIM', () => {
	describe('interval', async () => {
		it('has Symbol.asynIterator property', () => {
			const iter = AIM(data);
			assert.equal(typeof iter[Symbol.asyncIterator], 'function');
		});
		it('can be iterated', async () => {
			const iter = AIM(data);
			const actual = [];
			for await (let item of iter) actual.push(item);
			assert.deepStrictEqual(actual, data);
		});
		it('can be iterated slowly', async () => {
			const start = Date.now();
			const iter = AIM(data, 100);
			const actual = [];
			for await (let item of iter) actual.push(item);
			assert.deepStrictEqual(actual, data);
			const end = Date.now();
			assert(end > start + 400);
		});
	});
	describe('aim', () => {
		describe('has methods', async () => {
			const iter = AIM(data);
			it('has forEach', () => assert.equal(typeof iter.forEach, 'function'));
			it('has filter', () => assert.equal(typeof iter.filter, 'function'));
			it('has map', () => assert.equal(typeof iter.map, 'function'));
			it('has reduce', () => assert.equal(typeof iter.reduce, 'function'));
		});
		it('can forEach', async () => {
			const iter = AIM(data);
			const actual: Number[] = [];
			await iter.forEach((x, i) => {
				assert.equal(i, x - 1);
				actual.push(x);
			});
			assert.deepStrictEqual(actual, data);
		});
		it('can filter', async () => {
			const iter = AIM(data);
			const predicate = (x: number) => !!(x % 2);
			const result = await iter.filter(predicate).array();
			assert.deepStrictEqual(result, data.filter(predicate));
		});
		it('can map', async () => {
			const iter = AIM(data);
			const predicate = (x: number) => x * 2;
			const result = await iter.map(predicate).array();
			assert.deepStrictEqual(result, data.map(predicate));
		});
		it('can reduce', async () => {
			const iter = AIM(data);
			const predicate = (a: number, x: number) => a + x;
			const result = await iter.reduce(predicate, 0 as number);
			assert.deepStrictEqual(result, data.reduce(predicate, 0));
		});
	});
});
