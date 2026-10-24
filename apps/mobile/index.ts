import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent("main", () => App) and sets up
// the environment for both `expo run:*` dev-client builds and release native builds.
registerRootComponent(App);
