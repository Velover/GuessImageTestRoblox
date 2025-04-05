import { Controller, OnStart, OnInit } from "@flamework/core";
import React from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import App from "../Gui/App";

@Controller({})
export class GuiController implements OnStart, OnInit {
	onInit() {}

	onStart() {
		const container = Players.LocalPlayer.WaitForChild("PlayerGui");
		const root = createRoot(container);
		root.render(React.createElement(App));
	}
}
