interface RelativeTo {
	Vector2OnElement: (position: Vector2, elementPosition: Vector2) => UDim2;
}

declare const RelativeTo: RelativeTo;
export = RelativeTo;
