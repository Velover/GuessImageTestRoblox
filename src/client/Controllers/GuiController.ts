import { Controller, OnStart, OnInit } from "@flamework/core";
import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import App from "../Gui/App";

@Controller({})
export class GuiController implements OnStart, OnInit {
	onInit() {}

	onStart() {
		const container = new Instance("ScreenGui");
		container.ResetOnSpawn = false;
		container.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
		container.Parent = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

		const root = createRoot(container);
		root.render(React.createElement(App));
	}
}
