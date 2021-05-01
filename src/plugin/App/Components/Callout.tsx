import Roact from "@rbxts/roact";
import UIConfig from "plugin/Data/UIConfig";
import { ThemeWith } from "../Studio/Theme";

interface CalloutProps extends Roact.PropsWithChildren {
	Size: UDim2;
	Position: UDim2;
}

export default function (props: CalloutProps) {
	return ThemeWith((theme) => {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={props.Size}
				Position={props.Position}
				BackgroundColor3={theme.calloutBoxColor}
			>
				<uicorner CornerRadius={new UDim(0, 8)} />
				<uipadding
					PaddingBottom={new UDim(0, UIConfig.CalloutPadding)}
					PaddingTop={new UDim(0, UIConfig.CalloutPadding)}
					PaddingLeft={new UDim(0, UIConfig.CalloutPadding)}
					PaddingRight={new UDim(0, UIConfig.CalloutPadding)}
				/>
				{props[Roact.Children]}
			</frame>
		);
	});
}
