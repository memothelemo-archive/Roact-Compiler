import Roact from "@rbxts/roact";
import { ThemeWith } from "../Studio/Theme";

interface Props {
	[Roact.Children]?: Roact.Children;
}

export = (props: Props) => {
	return ThemeWith((theme) => {
		return (
			<frame BackgroundColor3={theme.backgroundColor} Size={UDim2.fromScale(1, 1)}>
				{props[Roact.Children]}
			</frame>
		);
	});
};
