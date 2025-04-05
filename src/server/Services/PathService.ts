import { OnInit, OnStart, Service } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";
import { TableTools } from "@rbxts/tool_pack";
import { DifficultyGameData } from "../GameData/DifficultyGameData";
import { PathGameData } from "../GameData/PathGameData";

interface ISectorModel extends Model {
	Image: BasePart & {
		Decal: Decal;
		Hint: Instance & {
			Text: TextLabel;
		};
	};
}

interface IPathRootModel extends BasePart {
	Gui: Instance & {
		Title: TextLabel;
		Difficulty: TextLabel;
	};
}

const global_root = Workspace.WaitForChild("GlobalRoot") as BasePart;
const path_root_template = Workspace.WaitForChild("PathRoot") as IPathRootModel;
const sector_template = Workspace.WaitForChild("Sector") as ISectorModel;

path_root_template.Parent = undefined;
sector_template.Parent = undefined;

const PATH_OFFSET = new Vector3(0, 0, 30);
const SECTOR_OFFSET = new Vector3(30, 0, 0);

const SECTOR_RESET_TIME = 4;

@Service({})
export class PathService implements OnStart, OnInit {
	onInit() {}

	onStart() {
		const paths_list = PathGameData.GetPaths();
		for (const path of paths_list) {
			this.PlaceNextPath(path);
		}

		Players.GetPlayers().forEach((player) => this.SetupPlayer(player));
		Players.PlayerAdded.Connect((player) => {
			this.SetupPlayer(player);
		});
	}

	private solutions_ = new Map<string, (() => void)[]>();
	private SetupPlayer(player: Player) {
		player.Chatted.Connect((message, recipient) => {
			if (recipient !== undefined) return;
			this.OnChatted(message);
		});
	}

	private OnChatted(message: string) {
		this.solutions_.forEach((solutions, guess) => {
			if (message.lower() !== guess.lower()) return;
			solutions.forEach((solution) => solution());
		});
	}

	private path_index_ = 0;
	private GetNextPathCFrame() {
		const saved_index = this.path_index_++;

		const offset_index = saved_index % 2 === 0 ? -(saved_index / 2) : math.ceil(saved_index / 2);
		const offset = PATH_OFFSET.mul(offset_index);
		return global_root.GetPivot().add(offset);
	}

	private PlaceNextPath(path: PathGameData.IPathData) {
		const path_cframe = this.GetNextPathCFrame();
		const path_root_clone = path_root_template.Clone();
		path_root_clone.Parent = Workspace;
		path_root_clone.CFrame = path_cframe;

		path_root_clone.Gui.Title.Text = path.Name;
		path_root_clone.Gui.Difficulty.Text = path.Difficulty;
		path_root_clone.Gui.Difficulty.TextColor3 = DifficultyGameData.GetDifficultyColor(
			path.Difficulty,
		);

		let i = 0;
		for (const sector_data of path.Sectors) {
			const cframe = path_cframe.add(SECTOR_OFFSET.mul(i++));
			this.CreateSector(sector_data, cframe);
		}
	}

	private CreateSector(sector: PathGameData.ISectorData, cframe: CFrame) {
		const sector_clone = sector_template.Clone();
		sector_clone.PivotTo(cframe);
		sector_clone.Parent = Workspace;

		const decal = sector_clone.Image.Decal;
		// decal.Texture = sector.ImageId;

		sector_clone.Image.Hint.Text.Text = sector.Guess;

		const solutions_list = TableTools.GetOrCreate(this.solutions_, sector.Guess, () => []);
		let is_open = false;
		const Open = () => {
			if (is_open) return;
			is_open = true;
			task.delay(SECTOR_RESET_TIME, () => {
				is_open = false;
				sector_clone.Image.Decal.Transparency = 0;
				sector_clone.Image.Transparency = 0;
				sector_clone.Image.CanCollide = true;
			});

			sector_clone.Image.Decal.Transparency = 0.5;
			sector_clone.Image.Transparency = 0.5;
			sector_clone.Image.CanCollide = false;
		};
		solutions_list.push(Open);
	}
}
