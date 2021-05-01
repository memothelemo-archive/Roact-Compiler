/// <reference types="@rbxts/types/plugin" />

import Roact from "@rbxts/roact";
import { App } from "./App";

// Creating App roact tree
const app = <App plugin={plugin} />;

// Mounting it
Roact.setGlobalConfig({
	elementTracing: true,
});
const tree = Roact.mount(app, undefined);

/**
 * If the plugin is about
 * to unload, then the app tree
 * is going to be unmounted
 */
plugin.Unloading.Connect(() => {
	Roact.unmount(tree);
});
