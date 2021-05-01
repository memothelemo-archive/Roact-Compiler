const Color3Utils = {
	AddColors: (color1: Color3, color2: Color3) => {
		return new Color3(color1.R + color2.R, color1.G + color2.G, color1.B + color2.G);
	},
};

export = Color3Utils;
