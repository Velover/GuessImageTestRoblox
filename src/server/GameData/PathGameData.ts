/* eslint-disable @typescript-eslint/no-require-imports */
import { Flamework } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";
import { InstanceTools } from "@rbxts/tool_pack";

export namespace PathGameData {
	const module = InstanceTools.WaitForPath<ModuleScript>(ReplicatedStorage, ["GameData", "Path"]);
	type PathsList = IPathData[];
	const guard = Flamework.createGuard<PathsList>();

	const data = require(module) as PathsList;
	assert(guard(data), `PathGameData: Failed to load data from ${script.GetFullName()}`);

	export interface IPathData {
		Name: string;
		Sectors: ISectorData[];
		ImageId: string;
		Difficulty: string;
	}

	export interface ISectorData {
		Guess: string;
		ImageId: string;
	}

	export function GetPaths(): PathsList {
		return data;
	}
}
