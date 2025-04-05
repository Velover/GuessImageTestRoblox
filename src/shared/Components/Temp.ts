import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

@Component({
	tag: "Temp",
})
class Temp extends BaseComponent<object, Instance> implements OnStart {
	onStart() {
		this.instance.Destroy();
	}
}
