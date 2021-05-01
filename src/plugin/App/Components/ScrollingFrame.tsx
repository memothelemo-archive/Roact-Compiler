import Roact from "@rbxts/roact";
import { ThemeWith } from "../Studio/Theme";

interface Props extends Roact.PropsWithChildren {
	AnchorPoint: Vector2;
	CanvasSize: UDim2 | Roact.Binding<UDim2>;
	Position: UDim2;
	Size: UDim2;
}

export default function (props: Props) {
	return ThemeWith((theme) => {
		return (
			<scrollingframe
				ScrollBarThickness={9}
				ScrollBarImageTransparency={0.5}
				ElasticBehavior={Enum.ElasticBehavior.Always}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				Size={props.Size}
				Position={props.Position}
				AnchorPoint={props.AnchorPoint}
				CanvasSize={props.CanvasSize}
				BorderSizePixel={0}
				BackgroundTransparency={1}
			>
				{props[Roact.Children]}
			</scrollingframe>
		);
	});
}
