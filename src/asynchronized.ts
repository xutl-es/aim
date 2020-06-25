export class Asynchronized<T> implements AsyncIterableIterator<T> {
	#iter: Iterator<T>;
	#wait: () => Promise<void>;
	constructor(iter: Iterator<T>, ms: number) {
		this.#iter = iter;
		if (ms) {
			this.#wait = () => new Promise((resolve) => setTimeout(resolve, ms));
		} else {
			this.#wait = Promise.resolve.bind(Promise);
		}
	}
	[Symbol.asyncIterator]() {
		return this;
	}
	async next() {
		await this.#wait();
		return this.#iter.next();
	}
	async return(rvalue: any): Promise<IteratorReturnResult<any>> {
		await this.#wait();
		const { value } = this.#iter.return ? this.#iter.return(rvalue) : { value: rvalue };
		return { done: true, value };
	}
	async throw(err?: Error) {
		await this.#wait();
		return this.#iter.throw ? this.#iter.throw(err) : Promise.reject(err);
	}
}
