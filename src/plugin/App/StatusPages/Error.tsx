import Roact from "@rbxts/roact";
import { TextService } from "@rbxts/services";
import UIConfig from "plugin/Data/UIConfig";
import BreakLine from "../Components/BreakLine";
import { Button } from "../Components/Button";
import Callout from "../Components/Callout";
import Centered from "../Components/Centered";
import { Page } from "../Components/Page";
import Paragraph from "../Components/Paragraph";
import ScrollingFrame from "../Components/ScrollingFrame";

interface States {}

interface Props {
	traceback: string;
	requestExit: () => void;
}

export class ErrorPage extends Roact.Component<Props, States> {
	public container: Roact.Binding<TextLabel>;
	public updateContainer: Roact.BindingFunction<TextLabel>;

	constructor(props: Props) {
		super(props);
		[this.container, this.updateContainer] = Roact.createBinding((undefined as unknown) as TextLabel);
	}

	render() {
		// Getting the scrolling frame's size by its output traceback
		const finalTraceback =
			"Please check the output window for more information," +
			" because sometimes it is not detailed to find errors there probably." +
			"\n\n" +
			this.props.traceback;
		return (
			<Page name={"Error"}>
				<Paragraph
					Font={UIConfig.ParagraphFonts.Bold}
					Size={UDim2.fromOffset(200, 30)}
					Text="This plugin caught an error!"
					Align={{
						X: Enum.TextXAlignment.Left,
					}}
				/>
				<Centered SizeY={new UDim(0, 200)}>
					<Callout Size={UDim2.fromScale(1, 1)} Position={UDim2.fromScale(0.5, 0.5)}>
						<ScrollingFrame
							AnchorPoint={new Vector2(0.5, 0.5)}
							CanvasSize={this.container.map((container) => {
								if (container === undefined) {
									return UDim2.fromScale(1, 0);
								}
								const frameSize = TextService.GetTextSize(
									finalTraceback,
									UIConfig.ErrorTracebackFontSize,
									UIConfig.ErrorTracebackFont,
									new Vector2(container.AbsoluteSize.X, math.huge),
								);
								return UDim2.fromOffset(0, frameSize.Y).add(UDim2.fromScale(1, 0));
							})}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(1, 1)}
						>
							<Paragraph
								Text={finalTraceback}
								Font={Enum.Font.Code}
								FontSize={16}
								Size={UDim2.fromScale(1, 1)}
								Align={{
									X: Enum.TextXAlignment.Left,
									Y: Enum.TextYAlignment.Top,
								}}
								ChangeInAbsoluteSize={(container) => {
									this.updateContainer(container);
								}}
							/>
						</ScrollingFrame>
					</Callout>
				</Centered>
				<BreakLine />
				<Centered SizeY={new UDim(0, UIConfig.ButtonHeight)}>
					<Button
						Text="Exit"
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromOffset(200, 50)}
						Active={true}
						OnClick={() => this.props.requestExit()}
					/>
				</Centered>
			</Page>
		);
	}
}
