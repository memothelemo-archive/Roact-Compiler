import Roact, { AnyComponent } from "@rbxts/roact";
import Dictionary from "libraries/Dictionary";

interface ThemeUI {
	backgroundColor?: Color3;
	buttonColor?: Color3;
	disabledButtonColor: Color3;
	calloutBoxColor: Color3;
	textColor?: Color3;

	isDark?: boolean;
}

interface Props {}
interface States {
	theme: ThemeUI;
	isDark: boolean;
}

const themes: Record<string, ThemeUI> = {
	lightTheme: {
		backgroundColor: Color3.fromRGB(243, 243, 243),
		disabledButtonColor: Color3.fromRGB(116, 116, 116),
		calloutBoxColor: Color3.fromRGB(230, 230, 230),
	},
	darkTheme: {
		disabledButtonColor: Color3.fromRGB(29, 29, 29),
		calloutBoxColor: Color3.fromRGB(56, 56, 56),
	},
};

const ThemeContext = Roact.createContext(themes.lightTheme);
const StudioSettings = settings().Studio;

export class ThemeProvider extends Roact.Component<Props, States> {
	public connection!: RBXScriptConnection;

	constructor(props: Props) {
		super(props);
		this.updateTheme();
	}

	updateTheme() {
		const currentStudioTheme = StudioSettings.Theme;
		if (currentStudioTheme.Name === "Light") {
			this.setState({
				theme: themes.lightTheme,
				isDark: false,
			});
		} else if (currentStudioTheme.Name === "Dark") {
			this.setState({
				theme: themes.darkTheme,
				isDark: true,
			});
		} else {
			warn("There's something wrong with ROBLOX Studio's theme today...");
			this.setState({
				theme: themes.lightTheme,
				isDark: false,
			});
		}
	}

	didMount() {
		this.connection = StudioSettings.ThemeChanged.Connect(() => {
			this.updateTheme();
		});
	}

	willUnmount() {
		if (this.connection !== undefined) {
			(this.connection as RBXScriptConnection).Disconnect();
		}
	}

	render() {
		const currentStudioTheme = StudioSettings.Theme;
		const finalThemeUI = Dictionary.merge(this.state.theme, {
			backgroundColor:
				(this.state.isDark && currentStudioTheme.GetColor("MainBackground")) ||
				this.state.theme.backgroundColor,
			buttonColor: currentStudioTheme.GetColor("Button"),
			textColor: currentStudioTheme.GetColor("MainText"),
			isDark: this.state.isDark,
		});
		return <ThemeContext.Provider value={finalThemeUI}>{this.props[Roact.Children]}</ThemeContext.Provider>;
	}
}

export function ThemeWith(callback: (theme: ThemeUI) => Roact.Element) {
	return Roact.createElement(ThemeContext.Consumer, {
		render: callback,
	});
}
