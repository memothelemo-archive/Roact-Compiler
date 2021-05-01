import Roact from "@rbxts/roact";
import Config from "plugin/Data/Config";
import Background from "./Components/Background";
import StudioButton from "./Components/Studio/StudioButton";
import StudioPluginContext from "./Components/Studio/StudioPluginContext";
import StudioToolbar from "./Components/Studio/StudioToolbar";
import StudioWidget from "./Components/Studio/StudioWidget";
import { ActivePage } from "./StatusPages/Active";
import { ErrorPage } from "./StatusPages/Error";
import { MainMenu } from "./StatusPages/MainMenu";
import { SelectModule } from "./StatusPages/SelectModule";
import { ThemeProvider } from "./Studio/Theme";

interface Props {
	plugin: Plugin;
}

interface States {
	interfaceComplied: (roact: unknown) => Roact.Element;
	guiEnabled: boolean;
	traceback: string;
	status: string;
}

export class App extends Roact.Component<Props, States> {
	private tree!: Roact.Tree;
	private moduleSource!: ModuleScript;

	constructor(props: Props) {
		super(props);

		this.setState({
			guiEnabled: Config.DEBUG_MODE,
			status: "MainMenu",
			traceback: "",
		});
	}

	cancelOperation() {
		if (this.tree) {
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
			return new Promise<void>((resolve) => {
				const updatedModule = (require(this.moduleSource.Clone()) as (roact: unknown) => Roact.Element)(Roact);
				const newInterface = <screengui>{updatedModule}</screengui>;
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
			const CoreGui = game.GetService("CoreGui");
			this.tree = Roact.mount(
				Roact.createElement(
					"ScreenGui",
					{},
					(this.state.interfaceComplied(Roact) as unknown) as Roact.Children,
				),
				CoreGui,
				"RC_Compiled",
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

	render() {
		return (
			<StudioPluginContext.Provider value={this.props.plugin}>
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
							status={this.state.status}
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
							status={this.state.status}
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
							status={this.state.status}
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
			</StudioPluginContext.Provider>
		);
	}

	willUnmount() {
		if (this.tree) {
			Roact.unmount(this.tree);
		}
	}
}
