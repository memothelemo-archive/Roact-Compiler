import Roact from "@rbxts/roact";

export default function (props: { Padding: number }) {
	return (
		<>
			<uilistlayout VerticalAlignment={Enum.VerticalAlignment.Center} />
			<uipadding
				PaddingLeft={new UDim(0, props.Padding)}
				PaddingRight={new UDim(0, props.Padding)}
				PaddingTop={new UDim(0, props.Padding)}
				PaddingBottom={new UDim(0, props.Padding)}
			/>
		</>
	);
}
