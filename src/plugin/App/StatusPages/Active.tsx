import Roact from "@rbxts/roact";
import UIConfig from "plugin/Data/UIConfig";
import { Button } from "../Components/Button";
import Centered from "../Components/Centered";
import { Page } from "../Components/Page";

interface States {}

interface Props {
	requestRerender: () => void;
	cancelOperation: () => void;
	status: string;
}

export class ActivePage extends Roact.Component<Props, States> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		return (
			<Page active={this.props.status === "Active"}>
				<Centered SizeY={new UDim(0, 50)}>
					<Button
						Active={true}
						Text="Update"
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromOffset(200, UIConfig.ButtonHeight)}
						OnClick={() => this.props.requestRerender()}
					/>
				</Centered>
				<Centered SizeY={new UDim(0, 50)}>
					<Button
						Active={true}
						Text="Exit"
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromOffset(200, UIConfig.ButtonHeight)}
						OnClick={() => this.props.cancelOperation()}
					/>
				</Centered>
			</Page>
		);
	}
}
