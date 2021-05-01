import Roact from "@rbxts/roact";
import Dictionary from "libraries/Dictionary";
import StudioPluginContext from "./StudioPluginContext";
import StudioWidgetContext from "./StudioWidgetContext";

interface Props {
	id: string;
	title: string;
	plugin?: Plugin;
	onClose?: () => void;

	initDockState?: Enum.InitialDockState;
	active?: boolean;
	overridePreviousState?: boolean;
	floatingSize?: Vector2;
	minimumSize?: Vector2;
	zIndexBehavior?: Enum.ZIndexBehavior;
}

class StudioWidgetPrototype extends Roact.Component<Props> {
	public pluginGui: DockWidgetPluginGui;
	public static defaultProps: Partial<Props> = {
		initDockState: Enum.InitialDockState.Left,
		active: false,
		overridePreviousState: false,
		floatingSize: new Vector2(0, 0),
		zIndexBehavior: Enum.ZIndexBehavior.Sibling,
	};

	constructor(props: Props) {
		super(props);

		const floatingSize = props.floatingSize as Vector2;
		const minimumSize = props.minimumSize as Vector2;

		const dockWidgetPluginInfo = new DockWidgetPluginGuiInfo(
			props.initDockState as Enum.InitialDockState,
			props.active as boolean,
			props.overridePreviousState as boolean,
			floatingSize.X,
			floatingSize.Y,
			minimumSize.X,
			minimumSize.Y,
		);

		const pluginGui = (props.plugin as Plugin).CreateDockWidgetPluginGui(props.id, dockWidgetPluginInfo);
		pluginGui.Name = props.id;
		pluginGui.Title = props.title;
		pluginGui.ZIndexBehavior = props.zIndexBehavior as Enum.ZIndexBehavior;
		pluginGui.Enabled = (props.active !== undefined && props.active) || false;

		pluginGui.BindToClose(() => {
			if (typeIs(props.onClose, "function")) {
				props.onClose();
			} else {
				pluginGui.Enabled = false;
			}
		});

		this.pluginGui = pluginGui;
	}

	didUpdate(lastProps: Props) {
		if (this.props.active !== lastProps.active) {
			this.pluginGui.Enabled = this.props.active as boolean;
		}
	}

	willUnmount() {
		this.pluginGui.Destroy();
	}

	render() {
		return (
			<Roact.Portal target={this.pluginGui}>
				<StudioWidgetContext.Provider value={(this.pluginGui as unknown) as undefined}>
					{this.props[Roact.Children]}
				</StudioWidgetContext.Provider>
			</Roact.Portal>
		);
	}
}

const Wrapper = (props: Props) => {
	return (
		<StudioPluginContext.Consumer
			render={(plugin) => {
				const finalProps = Dictionary.merge(props, {
					plugin: (plugin as unknown) as Plugin,
				});
				return Roact.createElement(StudioWidgetPrototype, finalProps);
			}}
		/>
	);
};

export = Wrapper;
