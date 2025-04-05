import React from "@rbxts/react";
import { Players } from "@rbxts/services";

export default function App() {
	return (
		<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} ResetOnSpawn={false}>
			<textbutton
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundColor3={new Color3(0, 0.388235, 0.898039)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.0, 0.5)}
				Size={UDim2.fromOffset(150, 50)}
				FontFace={new Font("rbxassetid://12187365364", Enum.FontWeight.Bold, Enum.FontStyle.Normal)}
				Text={"Go Back"}
				TextColor3={new Color3(1, 1, 1)}
				TextSize={25}
				Event={{
					MouseButton1Click: () => {
						Players.LocalPlayer.Character?.MoveTo(new Vector3(39.3, 8.5, 3.6));
					},
				}}
			>
				<uicorner />
			</textbutton>
		</screengui>
	);
}
