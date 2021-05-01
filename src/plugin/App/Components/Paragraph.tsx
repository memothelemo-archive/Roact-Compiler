import Roact from "@rbxts/roact";
import UIConfig from "plugin/Data/UIConfig";
import { ThemeWith } from "../Studio/Theme";

interface Props {
	Text: string;
	Font: Enum.Font;
	FontSize?: number;
	Size: UDim2;

	ChangeInAbsoluteSize?: (object: TextLabel) => void;

	Align?: {
		X?: Enum.TextXAlignment;
		Y?: Enum.TextYAlignment;
	};
}

export default function (props: Props) {
	// eslint-disable-next-line roblox-ts/lua-truthiness
	const finalFontSize = (props.FontSize === undefined && UIConfig.FontSize) || props.FontSize;
	return ThemeWith((theme) => {
		return (
			<textlabel
				Font={props.Font || UIConfig.ParagraphFonts.Normal}
				Size={props.Size}
				Text={props.Text}
				TextColor3={theme.textColor}
				TextSize={finalFontSize}
				TextXAlignment={props?.Align?.X}
				TextYAlignment={props?.Align?.Y}
				TextWrapped={true}
				BackgroundTransparency={1}
				Change={{
					AbsoluteSize: (object) => {
						if (props.ChangeInAbsoluteSize !== undefined) {
							props.ChangeInAbsoluteSize(object);
						}
					},
				}}
			/>
		);
	});
}
