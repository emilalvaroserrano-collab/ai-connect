import { r as __exportAll } from "../_runtime.mjs";
import { a as _components, c as _registerComponent, d as getApps, f as initializeApp, i as _apps, l as _serverApps, n as SDK_VERSION, o as _getProvider, p as registerVersion, r as _addComponent, s as _isFirebaseServerApp, t as DEFAULT_ENTRY_NAME, u as getApp } from "./@firebase/app+[...].mjs";
import { a as signInWithPopup, i as setPersistence, n as browserLocalPersistence, o as signOut, r as getAuth, t as GoogleAuthProvider } from "./firebase__auth.mjs";
//#region node_modules/firebase/app/dist/index.mjs
var dist_exports$1 = /* @__PURE__ */ __exportAll({
	SDK_VERSION: () => SDK_VERSION,
	_DEFAULT_ENTRY_NAME: () => DEFAULT_ENTRY_NAME,
	_addComponent: () => _addComponent,
	_apps: () => _apps,
	_components: () => _components,
	_getProvider: () => _getProvider,
	_isFirebaseServerApp: () => _isFirebaseServerApp,
	_registerComponent: () => _registerComponent,
	_serverApps: () => _serverApps,
	getApp: () => getApp,
	getApps: () => getApps,
	initializeApp: () => initializeApp,
	registerVersion: () => registerVersion
});
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
registerVersion("firebase", "13.1.0", "app");
//#endregion
//#region node_modules/firebase/auth/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({
	GoogleAuthProvider: () => GoogleAuthProvider,
	browserLocalPersistence: () => browserLocalPersistence,
	getAuth: () => getAuth,
	setPersistence: () => setPersistence,
	signInWithPopup: () => signInWithPopup,
	signOut: () => signOut
});
//#endregion
export { dist_exports$1 as n, dist_exports as t };
