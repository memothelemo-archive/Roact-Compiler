import Roact from "@rbxts/roact";
import Rodux from "@rbxts/rodux";
import Flipper from "@rbxts/flipper";
import Config from "plugin/Data/Config";
import { LoadedRoactModule } from "plugin/Types/Main";
import Background from "./Components/Background";
import StudioButton from "./Components/Studio/StudioButton";
import StudioPluginContext from "./Components/Studio/StudioPluginContext";
import StudioToolbar from "./Components/Studio/StudioToolbar";
import StudioWidget from "./Components/Studio/StudioWidget";
import StateContext from "./Contexts/StateContext";
import { ActivePage } from "./StatusPages/Active";
import { ErrorPage } from "./StatusPages/Error";
import { MainMenu } from "./StatusPages/MainMenu";
import { SelectModule } from "./StatusPages/SelectModule";
import { ThemeProvider } from "./Studio/Theme";
import { RunService } from "@rbxts/services";

interface Props {
	plugin: Plugin;
}

interface States {
	interfaceComplied: LoadedRoactModule;
	guiEnabled: boolean;
	traceback: string;
	status: string;
}

export class App extends Roact.Component<Props, States> {
	private tree!: Roact.Tree;
	private sessionGui!: ScreenGui;
	private moduleSource!: ModuleScript;
	private cancellationEvent: BindableEvent;

	constructor(props: Props) {
		super(props);

		this.cancellationEvent = new Instance("BindableEvent");
		this.setState({
			guiEnabled: Config.DEBUG_MODE,
			status: "MainMenu",
			traceback: "",
		});
	}

	cancelOperation() {
		if (this.tree) {
			this.cancellationEvent.Fire();
			RunService.RenderStepped.Wait();
			Roact.unmount(this.tree);
		}
		this.setState({
			interfaceComplied: () => {
				return (undefined as unknown) as Roact.Element;
			},
		});
	}

	updateTree() {
		if (this.tree) {
			return new Promise<void>((resolve, reject) => {
				if (this.moduleSource === undefined) {
					this.cancelOperation();
					return reject("Failed to load the active ModuleScript, maybe you deleted it?");
				}

				this.cancellationEvent.Fire();
				const updatedModule = (require(this.moduleSource.Clone()) as LoadedRoactModule)(
					Roact,
					{
						flipper: Flipper,
						rodux: Roact,
					},
					this.cancellationEvent.Event,
				);
				const newInterface = updatedModule;
				Roact.update(this.tree, newInterface);
				resolve();
			}).catch((traceback) => {
				this.setState({
					traceback: traceback,
					status: "Error",
				});
			});
		}
	}

	compile() {
		// Attempting to load the tree
		return new Promise<void>((resolve) => {
			this.tree = Roact.mount(
				this.state.interfaceComplied(
					Roact,
					{
						flipper: Flipper,
						rodux: Rodux,
					},
					this.cancellationEvent.Event,
				),
				this.sessionGui,
			);
			resolve();

			/**
			 * Updating the interface because
			 * the ModuleScript is loaded with the last source code
			 */
			this.updateTree();
		}).catch((traceback) => {
			this.setState({
				traceback: traceback,
				status: "Error",
			});
		});
	}

	cloneToPlayerGui() {
		const StarterGui = game.GetService("StarterGui");
		StarterGui.FindFirstChild("RC_Compiled")?.Destroy();
		this.sessionGui.Clone().Parent = StarterGui;
	}

	didMount() {
		const CoreGui = game.GetService("CoreGui");
		this.sessionGui = new Instance("ScreenGui");
		this.sessionGui.Parent = CoreGui;
		this.sessionGui.Name = "RC_Compiled";
	}

	render() {
		return (
			<StudioPluginContext.Provider value={this.props.plugin}>
				<StateContext.Provider value={this.state.status}>
					{/* For the plugin's gui */}
					<ThemeProvider>
						<StudioWidget
							id={Config.PluginId + "-main-widget"}
							title={Config.PluginName + " " + Config.Version}
							active={this.state.guiEnabled}
							floatingSize={new Vector2(300, 300)}
							minimumSize={new Vector2(300, 300)}
							onClose={() => {
								this.setState({
									guiEnabled: false,
								});
							}}
						>
							<Background />
							<MainMenu
								onExitClick={() => {
									this.setState({
										guiEnabled: false,
									});
								}}
								onStartClick={() => {
									this.setState({
										status: "SelectModule",
									});
								}}
							/>
							<ErrorPage
								traceback={tostring(this.state.traceback)}
								requestExit={() => {
									this.cancelOperation();
									this.setState({
										status: "MainMenu",
									});
								}}
							/>
							<SelectModule
								status={this.state.status}
								onCancel={() => {
									this.setState({
										status: "MainMenu",
									});
								}}
								onError={(traceback) => {
									this.setState({
										status: "Error",
										traceback: traceback,
									});
								}}
								onModuleFound={(unknownModule, originalSource) => {
									this.moduleSource = originalSource;
									this.setState({
										status: "Active",
										interfaceComplied: unknownModule,
									});
									this.compile();
								}}
							/>
							<ActivePage
								requestClone={() => this.cloneToPlayerGui()}
								requestRerender={() => this.updateTree()}
								cancelOperation={() => {
									this.setState({
										status: "MainMenu",
									});
									this.cancelOperation();
								}}
							/>
						</StudioWidget>
					</ThemeProvider>

					{/* For the plugin itself*/}
					<StudioToolbar name="memothelemo">
						<StudioButton
							name={Config.PluginName}
							tooltip="Show or hide the Roact Compiler panel"
							icon={Config.IconId}
							text={Config.PluginName}
							active={this.state.guiEnabled}
							enabled={true}
							onClick={() => {
								this.setState({
									guiEnabled: !this.state.guiEnabled,
								});
							}}
						/>
					</StudioToolbar>
				</StateContext.Provider>
			</StudioPluginContext.Provider>
		);
	}

	willUnmount() {
		if (this.tree) {
			Roact.unmount(this.tree);
		}
		this.cancellationEvent.Destroy();
		this.sessionGui.Destroy();
	}
}
