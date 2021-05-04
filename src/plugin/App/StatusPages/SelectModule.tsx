import Roact from "@rbxts/roact";
import AttemptLoadModule from "libraries/AttemptLoadModule";
import UIConfig from "plugin/Data/UIConfig";
import { LoadedRoactModule } from "plugin/Types/Main";
import { Button } from "../Components/Button";
import Centered from "../Components/Centered";
import Header from "../Components/Header";
import { Page } from "../Components/Page";
import Paragraph from "../Components/Paragraph";

interface States {
	prompt: string;
}

interface Props {
	status: string;
	onError: (traceback: string) => void;
	onCancel: () => void;
	onModuleFound: (passedModule: LoadedRoactModule, moduleScript: ModuleScript) => void;
}

const promptTexts = {
	noModule: "Please select a Roact component to compile",
	noObject: "Please select an object.",
	notModuleScript: "The following selected object is not a ModuleScript",
	multipleObjects: "Please select only one object",
};

export class SelectModule extends Roact.Component<Props, States> {
	private selectionConnection!: RBXScriptConnection;
	private thatModule!: ModuleScript;

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

	isSelectedObjectsVaild(objects: Instance[]) {
		// Making sure if it is not more than 1 objects
		if (objects.size() !== 1) {
			return ([false, promptTexts.multipleObjects] as unknown) as LuaTuple<[boolean, string]>;
		}

		// Making sure if it is a ModuleScript class
		if (!objects[0].IsA("ModuleScript")) {
			return ([false, promptTexts.notModuleScript] as unknown) as LuaTuple<[boolean, string]>;
		}

		return ([true, "Success"] as unknown) as LuaTuple<[boolean, string]>;
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

		const [isVaild, promptError] = this.isSelectedObjectsVaild(selectedObjects);
		if (!isVaild) {
			return this.setState({
				prompt: promptError,
			});
		}
		const object = selectedObjects[0];

		// Making sure if there's no script conflicts
		AttemptLoadModule(object as ModuleScript)
			.then((module) => {
				// Making sure if it is a function!
				if (!typeIs(module, "function")) {
					return this.setState({
						prompt: "The following ModuleScript is not returned as function!",
					});
				}
				this.thatModule = object as ModuleScript;
				this.props.onModuleFound(module as LoadedRoactModule, this.thatModule);
			})
			.catch((traceback) => {
				this.props.onError(traceback);
			});
	}

	stopSession() {
		this.thatModule = (undefined as unknown) as ModuleScript;
		if (this.selectionConnection !== undefined) {
			this.selectionConnection.Disconnect();
		}
	}

	didMount() {
		this.selectionConnection = game.GetService("Selection").SelectionChanged.Connect(() => {
			const selectedObjects = game.GetService("Selection").Get();
			if (selectedObjects.size() !== 0) {
				this.evaluateSelection();
			} else {
				this.setState({
					prompt: promptTexts.noModule,
				});
			}
		});
	}

	render() {
		return (
			<Page name={"SelectModule"}>
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
							this.stopSession();
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
