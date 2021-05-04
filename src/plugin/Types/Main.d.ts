import Roact from "@rbxts/roact";

export type LoadedRoactModule = (
	roact: unknown,
	libs?: { flipper: unknown; rodux: unknown },
	onCancel?: RBXScriptSignal,
) => Roact.Element;
