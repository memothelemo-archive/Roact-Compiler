import Roact from "@rbxts/roact";
import Dictionary from "libraries/Dictionary";
import StudioPluginContext from "./StudioPluginContext";
import StudioToolbarContext from "./StudioToolbarContext";

interface Props {
	name: string;
	plugin: Plugin;
}

class StudioToolbarPrototype extends Roact.Component<Props> {
	public toolbar: PluginToolbar;

	constructor(props: Props) {
		super(props);
		this.toolbar = props.plugin.CreateToolbar(props.name);
	}

	render() {
		return (
			<StudioToolbarContext.Provider value={(this.toolbar as unknown) as undefined}>
				{this.props[Roact.Children]}
			</StudioToolbarContext.Provider>
		);
	}

	willUnmount() {
		this.toolbar.Destroy();
	}
}

const Wrapper = (props: { name: string }) => {
	return (
		<StudioPluginContext.Consumer
			render={(plugin: Plugin) => {
				const finalProps = Dictionary.merge(props, {
					plugin: plugin,
				});
				return Roact.createElement(StudioToolbarPrototype, finalProps);
			}}
		/>
	);
};

export = Wrapper;
