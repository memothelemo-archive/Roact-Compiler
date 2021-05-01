import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import UIConfig from "plugin/Data/UIConfig";
import { ThemeWith } from "../Studio/Theme";
import Shadow from "./Shadow";
import Color3Utils from "libraries/Color3Utils";
import { SnackbarCircle } from "./SnackbarCircle";
import RelativeTo from "libraries/RelativeTo";

interface States {
	isHighlighted: boolean;
	isHoldingDown: boolean;
	lastMousePositionClicked: Vector2;
}

interface Props {
	Position?: UDim2;
	Size: UDim2;
	Active?: boolean;
	Text: string;
	OnClick?: () => void;
}

export class Button extends Roact.Component<Props, States> {
	// Private
	private motor: Flipper.SingleMotor;
	private clickedBinding: Roact.Binding<number>;
	private updateAlpha: Roact.BindingFunction<number>;
	private snackbarCircle!: Roact.Element;
	private realButtonRef: Roact.Ref<TextButton>;

	// Static
	public static defaultProps: Partial<Props> = {
		Text: "Button",
		Active: true,
	};
	constructor(props: Props) {
		super(props);
		[this.clickedBinding, this.updateAlpha] = Roact.createBinding(0);

		this.realButtonRef = Roact.createRef();
		this.motor = new Flipper.SingleMotor(0);
		this.motor.onStep(this.updateAlpha);
	}
	render() {
		const pushedAlpha = (this.state.isHighlighted && 1) || 0;

		this.motor.setGoal(
			new Flipper.Spring(pushedAlpha, {
				dampingRatio: 1,
				frequency: 3,
			}),
		);

		return ThemeWith((theme) => {
			const finalPos = this.props.Position || new UDim2();
			return (
				<Shadow Position={finalPos} AnchorPoint={new Vector2(0.5, 0.5)} Size={this.props.Size}>
					<textbutton
						Ref={this.realButtonRef}
						AutoButtonColor={false}
						ClipsDescendants={true}
						BackgroundColor3={this.clickedBinding.map((ratio) => {
							// If the button is disabled then set it to disabled button color
							if (this.props.Active === false) {
								return theme.disabledButtonColor;
							}
							const c = (((theme.isDark as unknown) as boolean) && 1) || -1;
							const h = UIConfig.HighlightOverlay * c;
							const highlightColor = Color3Utils.AddColors(
								theme.buttonColor as Color3,
								Color3.fromRGB(h, h, h),
							);
							return (theme.buttonColor as Color3).Lerp(highlightColor, ratio);
						})}
						Text={this.props.Text}
						TextColor3={theme.textColor}
						TextSize={UIConfig.FontSize}
						Font={UIConfig.ButtonFont}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 1).sub(UDim2.fromOffset(6, 6))}
						Event={{
							MouseButton1Down: (_, x, y) => {
								if (this.props.Active) {
									this.setState({
										isHoldingDown: true,
										lastMousePositionClicked: new Vector2(x, y),
									});
								}
							},
							MouseButton1Up: () => {
								if (this.props.Active) {
									this.setState({
										isHoldingDown: false,
										isHighlighted: false,
									});
								}
							},
							MouseEnter: () => {
								if (this.props.Active) {
									this.setState({
										isHighlighted: true,
										isHoldingDown: false,
									});
								}
							},
							MouseLeave: () => {
								if (this.props.Active) {
									this.setState({
										isHighlighted: false,
										isHoldingDown: false,
									});
								}
							},
							MouseButton1Click: () => {
								if (this.props.OnClick !== undefined) {
									this.props.OnClick();
								}
							},
						}}
					>
						<SnackbarCircle
							enabled={this.state.isHoldingDown}
							mouseClickOrigin={RelativeTo.Vector2OnElement(
								this.state.lastMousePositionClicked,
								this.realButtonRef.getValue()?.AbsolutePosition as Vector2,
							)}
							initialRadius={10}
							radius={200}
						/>
						<uicorner CornerRadius={new UDim(0, 8)} />
					</textbutton>
				</Shadow>
			);
		});
	}
}
