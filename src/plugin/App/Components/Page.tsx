import Roact from "@rbxts/roact";
import UIConfig from "plugin/Data/UIConfig";
import Layout from "./Layout";

interface States {}

interface Props {
	active: boolean;
}

export class Page extends Roact.Component<Props, States> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		return (
			<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)} Visible={this.props.active}>
				<Layout Padding={UIConfig.DefaultPadding} />
				{this.props[Roact.Children]}
			</frame>
		);
	}
}
