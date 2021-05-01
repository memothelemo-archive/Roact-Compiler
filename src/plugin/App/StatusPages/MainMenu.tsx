import Roact from "@rbxts/roact";
import Config from "plugin/Data/Config";
import UIConfig from "plugin/Data/UIConfig";
import BreakLine from "../Components/BreakLine";
import { Button } from "../Components/Button";
import Centered from "../Components/Centered";
import { Page } from "../Components/Page";
import Paragraph from "../Components/Paragraph";

interface States {}

interface Props {
	status: string;
	onExitClick: () => void;
	onStartClick: () => void;
}

export class MainMenu extends Roact.Component<Props, States> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		return (
			<Page active={this.props.status === "MainMenu"}>
				<Centered SizeY={new UDim(0, 80)}>
					<imagelabel
						Image={"rbxassetid:/" + Config.IconId}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						BackgroundTransparency={1}
						Size={UDim2.fromOffset(80, 80)}
					/>
				</Centered>
				<BreakLine />
				<Centered SizeY={new UDim(0, 50)}>
					<Button
						Active={true}
						Text="Start Session"
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromOffset(200, UIConfig.ButtonHeight)}
						OnClick={() => this.props.onStartClick()}
					/>
				</Centered>
				<Centered SizeY={new UDim(0, 50)}>
					<Button
						Active={true}
						Text="Exit"
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromOffset(200, UIConfig.ButtonHeight)}
						OnClick={() => this.props.onExitClick()}
					/>
				</Centered>
				<Paragraph
					Font={UIConfig.ParagraphFonts.Bold}
					Size={UDim2.fromScale(1, 0).add(UDim2.fromOffset(0, 30))}
					Text={Config.Version}
				/>
				<Paragraph
					Font={UIConfig.ParagraphFonts.Normal}
					Size={UDim2.fromScale(1, 0).add(UDim2.fromOffset(0, 30))}
					Text="Made by memothelemo"
				/>
			</Page>
		);
	}
}
