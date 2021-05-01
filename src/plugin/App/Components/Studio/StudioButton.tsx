import Roact from "@rbxts/roact";
import Dictionary from "libraries/Dictionary";
import StudioToolbarContext from "./StudioToolbarContext";

interface Props {
	toolbar: PluginToolbar;
	onClick?: () => void;

	name: string;
	icon: string;
	text: string;
	tooltip: string;

	enabled?: boolean;
	active?: boolean;
}

interface WrapperProps extends Partial<Props> {
	name: string;
	icon: string;
	text: string;
	tooltip: string;
	enabled: boolean;
	active: boolean;
	onClick?: () => void;
}

class StudioButtonPrototype extends Roact.Component<Props> {
	public button: PluginToolbarButton;
	public static defaultProps: Partial<Props> = {
		active: false,
		enabled: true,
	};

	constructor(props: Props) {
		super(props);

		const button = props.toolbar.CreateButton(props.name, props.tooltip, "rbxassetid://" + props.icon, props.text);
		button.SetActive(props.active as boolean);
		button.ClickableWhenViewportHidden = false;

		if (typeIs(props.onClick, "function")) {
			button.Click.Connect(() => {
				(props.onClick as () => void)();
			});
		}

		this.button = button;
	}

	render() {
		return undefined;
	}

	didUpdate(lastProps: Props) {
		if (this.props.enabled !== lastProps.enabled) {
			this.button.Enabled = this.props.enabled as boolean;
		}
		if (this.props.active !== lastProps.active) {
			this.button.SetActive(this.props.active as boolean);
		}
	}

	willUnmount() {
		this.button.Destroy();
	}
}

const Wrapper = (props: WrapperProps) => {
	return (
		<StudioToolbarContext.Consumer
			render={(toolbar) => {
				const finalProps = Dictionary.merge(props, {
					toolbar: (toolbar as unknown) as PluginToolbar,
				});
				return Roact.createElement(StudioButtonPrototype, finalProps);
			}}
		/>
	);
};

export = Wrapper;
