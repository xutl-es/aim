export interface IteratorMapCallback<I, O> {
	(value: I, index: number): O | Promise<O>;
}

export class MapIterator<I, O> implements AsyncIterableIterator<O> {
	#source: AsyncIterator<I>;
	#callback: IteratorMapCallback<I, O>;
	constructor(source: AsyncIterator<I>, callback: IteratorMapCallback<I, O>) {
		this.#source = source;
		this.#callback = callback;
	}
	public [Symbol.asyncIterator]() {
		return this;
	}
	#done: boolean = false;
	#index = 0;
	public async next(): Promise<IteratorResult<O>> {
		if (this.#done) return { done: true, value: null };
		const { done, value } = await this.#source.next();
		this.#done = !!done;
		if (done) return { done: true, value: null };
		const result = await this.#callback(value, this.#index++);
		return { done, value: result };
	}
	public async return(value?: I): Promise<IteratorResult<O, O | null>> {
		const { done, value: result } = this.#source.return ? await this.#source.return(value) : { done: true, value };
		if (result === undefined || result === null) return { done: true, value: null };
		const retval = await this.#callback(result, this.#index++);
		return { done, value: retval };
	}
	public async throw(error?: any): Promise<IteratorResult<O>> {
		if (!this.#source.throw) throw error;
		await this.#source.throw(error);
		return { done: true, value: null };
	}
}
