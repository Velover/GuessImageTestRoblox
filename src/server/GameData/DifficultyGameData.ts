/* eslint-disable @typescript-eslint/no-require-imports */
import { Flamework } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";
import { InstanceTools } from "@rbxts/tool_pack";

export namespace DifficultyGameData {
	const module = InstanceTools.WaitForPath<ModuleScript>(ReplicatedStorage, [
		"GameData",
		"Difficulty",
	]);

	type DifficultyMap = Map<string, Color3>;
	const guard = Flamework.createGuard<DifficultyMap>();
	const data = require(module) as DifficultyMap;
	assert(guard(data), `DifficultyGameData: Failed to load data from ${module.GetFullName()}`);

	export function GetDifficultyColor(difficulty: string): Color3 {
		return data.get(difficulty) ?? Color3.fromRGB(90, 90, 90);
	}
}
