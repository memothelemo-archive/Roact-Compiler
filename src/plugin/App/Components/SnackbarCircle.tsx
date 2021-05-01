import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import UIConfig from "plugin/Data/UIConfig";

interface States {}

interface Props {
	enabled: boolean;
	initialRadius: number;
	radius: number;
	mouseClickOrigin?: UDim2;
}

export class SnackbarCircle extends Roact.Component<Props, States> {
	private motor: Flipper.SingleMotor;
	private alpha: Roact.Binding<number>;
	private updateAlpha: Roact.BindingFunction<number>;

	constructor(props: Props) {
		super(props);

		[this.alpha, this.updateAlpha] = Roact.createBinding(0);
		this.motor = new Flipper.SingleMotor(0);
		this.motor.onStep(this.updateAlpha);
	}

	render() {
		const mouseClickOrigin = this.props.mouseClickOrigin as UDim2;
		// Slow-mo
		if (this.props.enabled) {
			this.motor.setGoal(
				new Flipper.Spring(1, {
					frequency: 1,
					dampingRatio: 2,
				}),
			);
		} else {
			this.motor.setGoal(new Flipper.Instant(0));
		}

		return (
			<imagelabel
				Image={"http://www.roblox.com/asset/?id=660373145"}
				ImageTransparency={this.alpha.map((alpha) => {
					if (!this.props.enabled) {
						return 1;
					}
					return UIConfig.SnackbarCircle_HF - (1 - UIConfig.SnackbarCircle_HI) * (1 - alpha);
				})}
				BackgroundTransparency={1}
				Size={this.alpha.map((alpha) => {
					return UDim2.fromOffset(
						alpha * this.props.radius + this.props.initialRadius,
						alpha * this.props.radius + this.props.initialRadius,
					);
				})}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={(mouseClickOrigin === undefined && UDim2.fromScale(0.5, 0.5)) || mouseClickOrigin}
			/>
		);
	}
	willUnmount() {
		this.motor.destroy();
	}
}
