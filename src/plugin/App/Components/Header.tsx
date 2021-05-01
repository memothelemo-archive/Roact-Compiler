import Roact from "@rbxts/roact";
import UIConfig from "plugin/Data/UIConfig";
import { ThemeWith } from "../Studio/Theme";

interface HeaderProps {
	Text?: string;
	Size?: UDim2;
	Font?: Enum.Font;
	Position?: UDim2;
}

export default function (props: HeaderProps) {
	return ThemeWith((theme) => {
		return (
			<textlabel
				Position={(props.Position === undefined && new UDim2()) || props.Position}
				Font={(props.Font !== undefined && props.Font) || UIConfig.HeaderFont}
				FontSize={Enum.FontSize.Size32}
				Size={(props.Size === undefined && new UDim2(1, 0, 0, 40)) || props.Size}
				Text={(props.Text === undefined && "Header") || props.Text}
				TextColor3={theme.textColor}
				TextWrapped={true}
				BackgroundTransparency={1}
			/>
		);
	});
}
