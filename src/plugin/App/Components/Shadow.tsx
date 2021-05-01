import Roact from "@rbxts/roact";

interface Props {
	AnchorPoint?: Vector2;
	Size?: UDim2 | Roact.Binding<UDim2>;
	Position?: UDim2 | Roact.Binding<UDim2>;
}

export default function (props: Props & Roact.PropsWithChildren) {
	const ref = Roact.createRef<ImageLabel>();
	return (
		<imagelabel
			Ref={ref}
			AnchorPoint={props.AnchorPoint || new Vector2()}
			Image="http://www.roblox.com/asset/?id=6486382942"
			ImageColor3={new Color3(0, 0, 0)}
			ImageTransparency={0.5}
			SliceScale={0.042}
			SliceCenter={new Rect(new Vector2(256, 256), new Vector2(256, 256))}
			ScaleType={Enum.ScaleType.Slice}
			Size={(props.Size as UDim2) || new UDim2()}
			Position={(props.Position as UDim2) || new UDim2()}
			BackgroundTransparency={1}
		>
			{props[Roact.Children]}
		</imagelabel>
	);
}
