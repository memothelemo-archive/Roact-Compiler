import Roact from "@rbxts/roact";
import UIConfig from "plugin/Data/UIConfig";
import StateContext from "../Contexts/StateContext";
import Layout from "./Layout";

interface States {}

interface Props {
	name: string;
}

export class Page extends Roact.Component<Props, States> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		return (
			<StateContext.Consumer
				render={(status) => {
					return (
						<frame
							BackgroundTransparency={1}
							Size={UDim2.fromScale(1, 1)}
							Visible={status === this.props.name}
						>
							<Layout Padding={UIConfig.DefaultPadding} />
							{this.props[Roact.Children]}
						</frame>
					);
				}}
			/>
		);
	}
}
