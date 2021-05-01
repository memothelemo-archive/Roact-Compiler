import Roact from "@rbxts/roact";

export default function (props: Roact.PropsWithChildren & { SizeY: UDim }) {
	return (
		<textlabel Size={new UDim2(1, 0, props.SizeY.Scale, props.SizeY.Offset)} BackgroundTransparency={1}>
			{props[Roact.Children]}
		</textlabel>
	);
}
