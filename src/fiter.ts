export interface IteratorFilterCallback<I> {
	(value: I, index: number): boolean | Promise<boolean>;
}

export class FilterIterator<I> implements AsyncIterableIterator<I> {
	#source: AsyncIterator<I>;
	#callback: IteratorFilterCallback<I>;
	constructor(source: AsyncIterator<I>, callback: IteratorFilterCallback<I>) {
		this.#source = source;
		this.#callback = callback;
	}
	public [Symbol.asyncIterator]() {
		return this;
	}
	#done: boolean = false;
	#index = 0;
	public async next(): Promise<IteratorResult<I>> {
		while (!this.#done) {
			const { done, value } = await this.#source.next();
			this.#done = !!done;
			if (done) return { done: true, value: null };
			const pass = await this.#callback(value, this.#index++);
			if (pass) return { done, value };
		}
		return { done: true, value: null };
	}
	public async return(retvalue?: I): Promise<IteratorResult<I>> {
		const { done, value } = this.#source.return ? await this.#source.return(retvalue) : { done: true, value: retvalue };
		const pass = await this.#callback(value, this.#index++);
		if (pass) return { done, value };
		return { done: true, value: null };
	}
	public async throw(error?: any): Promise<IteratorResult<I>> {
		if (!this.#source.throw) throw error;
		await this.#source.throw(error);
		return { done: true, value: null };
	}
}
