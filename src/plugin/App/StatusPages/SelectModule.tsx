import Roact from "@rbxts/roact";
import { Selection } from "@rbxts/services";
import AttemptLoadModule from "libraries/AttemptLoadModule";
import UIConfig from "plugin/Data/UIConfig";
import { Button } from "../Components/Button";
import Centered from "../Components/Centered";
import Header from "../Components/Header";
import Layout from "../Components/Layout";
import { Page } from "../Components/Page";
import Paragraph from "../Components/Paragraph";

interface States {
	prompt: string;
}

interface Props {
	status: string;
	onError: (traceback: string) => void;
	onCancel: () => void;
	onModuleFound: (passedModule: (roact: unknown) => Roact.Element, moduleScript: ModuleScript) => void;
}

const promptTexts = {
	noModule: "Please select a Roact component to compile",
};

export class SelectModule extends Roact.Component<Props, States> {
	private selectionConnection!: RBXScriptConnection;
	private thatModule!: ModuleScript;
	private isActive!: boolean;

	constructor(props: Props) {
		super(props);
		this.setState({
			prompt: promptTexts.noModule,
		});
	}

	didUpdate(lastProps: Props) {
		if (this.props.status === "SelectModule") {
			if (lastProps.status !== this.props.status) {
				const Selection = game.GetService("Selection");
				Selection.Set([]);
			}
		}
	}

	evaluateSelection() {
		if (this.props.status !== "SelectModule") {
			return this.setState({
				prompt: promptTexts.noModule,
			});
		}

		/**
		 * Making sure that following selected
		 * object contains:
		 *  - Only one object
		 *  - ModuleScript
		 *  - No modulescript conflicts
		 *  - A Roact component
		 */
		const Selection = game.GetService("Selection");
		const selectedObjects = Selection.Get();

		if (selectedObjects.size() === 0) {
			return this.setState({
				prompt: "Please select an object",
			});
		}

		if (selectedObjects.size() > 1) {
			return this.setState({
				prompt: "Please select only one object!",
			});
		}

		// Checking if it is a module script
		const object = selectedObjects[0];
		if (!object.IsA("ModuleScript")) {
			return this.setState({
				prompt: "This selected object is not a ModuleScript",
			});
		}

		// Making sure if there's no script conflicts
		AttemptLoadModule(object as ModuleScript)
			.then((module) => {
				type thatLoadedModule = (roact: unknown) => Roact.Element;

				// Making sure if it is a function!
				if (!typeIs(module, "function")) {
					return this.setState({
						prompt: "The following ModuleScript is not returned as function!",
					});
				}
				this.thatModule = object as ModuleScript;
				this.props.onModuleFound(module as thatLoadedModule, this.thatModule);
			})
			.catch((traceback) => {
				this.props.onError(traceback);
			});
	}

	stop() {
		this.thatModule = (undefined as unknown) as ModuleScript;
		if (this.selectionConnection !== undefined) {
			this.selectionConnection.Disconnect();
		}
	}

	didMount() {
		this.selectionConnection = game
			.GetService("Selection")
			.SelectionChanged.Connect(() => this.evaluateSelection());
	}

	render() {
		return (
			<Page active={this.props.status === "SelectModule"}>
				<Header
					Font={Enum.Font.SourceSansBold}
					Text={this.state.prompt}
					Size={UDim2.fromScale(1, 0).add(UDim2.fromOffset(0, 150))}
				/>
				<Centered SizeY={new UDim(0, 50)}>
					<Button
						Active={true}
						Text="Cancel"
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromOffset(200, UIConfig.ButtonHeight)}
						OnClick={() => {
							this.stop();
							this.props.onCancel();
						}}
					/>
				</Centered>
				<Paragraph
					Font={UIConfig.ParagraphFonts.Normal}
					Size={UDim2.fromScale(1, 0).add(UDim2.fromOffset(0, 100))}
					Text="Note: If you selected a ModuleScript and then it doesn't automatically load, please reload your place and try again. It does that for some reason."
				/>
			</Page>
		);
	}

	willUnmount() {
		if (this.selectionConnection !== undefined) {
			this.selectionConnection.Disconnect();
		}
	}
}
