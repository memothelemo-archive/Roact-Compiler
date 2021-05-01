interface Dictionary {
	readonly None: {};
	readonly merge: <R, A>(root: R, extension: A) => R & A;
}

declare const Dictionary: Dictionary;
export = Dictionary;
