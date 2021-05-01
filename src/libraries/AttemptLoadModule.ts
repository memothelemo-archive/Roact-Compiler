export = (moduleScript: ModuleScript) => {
	return new Promise<unknown>((resolve) => {
		const loadedModule = require(moduleScript.Clone());
		resolve(loadedModule);
	});
};
