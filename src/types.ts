import Collector from "./collector";

// Function types
type AnyVoid = Promise<void> | void;

export type AnyVoidCB = () => AnyVoid;

export type AnyCB = () => Promise<any> | any;

export type MacroCB<T extends any[]> = (...macroArgs: T) => AnyVoid;

export type LogFn = (...args: any[]) => void;

export type Title<T extends any[]> = string | ((...args: T) => string);

export interface Hooks {
	beforeAll: AnyVoidCB;
	beforeEach: AnyVoidCB;
	afterAll: AnyVoidCB;
	afterEach: AnyVoidCB;
}

export interface Context {
	passed: number;
	failed: number;
	testRuntime: number;
	errors: [any, string][];
}

// Configuration

export interface Configuration {
	collector: CollectorConfiguration;
	colors: boolean;
	printFileNames: boolean;
	bubbleHooks: boolean;
	volume: number;
	dev: boolean;
	require?: string[];
}

export interface CollectorConfiguration {
	root?: string;
	match?: string | string[];
	ignore?: string | string[];
}

// Actions

export interface Action {
	type:
		| "it"
		| "describe"
		| "describe-start"
		| "describe-end"
		| "doOnce"
		| "setHook"
		| "configure"
		| "file-start"
		| "file-end"
		| "global-setup"
		| "global-teardown";
}

export interface ItAction<T extends any[]> extends Action {
	type: "it";
	title: string;
	cb: MacroCB<T>;
	args: T;
}

export interface GroupStartAction extends Action {
	type: "describe-start" | "file-start";
	title: string;
	hooks: (() => void)[];
}

export interface DescribeAction<T extends any[]> extends Action {
	type: "describe";
	cb: MacroCB<T>;
	args: T;
}

export interface DescribeStartAction extends GroupStartAction {
	type: "describe-start";
}

export interface DescribeEndAction extends GroupEndAction {
	type: "describe-end";
}

export interface FileStartAction extends GroupStartAction {
	type: "file-start";
}

export interface GroupEndAction extends Action {
	type: "describe-end" | "file-end";
}

export interface FileEndAction extends GroupEndAction {
	type: "file-end";
}

export interface SetHookAction extends Action {
	type: "setHook";
	cb: AnyVoidCB;
}

export interface DoOnceAction extends Action {
	type: "doOnce";
	cb: AnyCB;
}

export interface ConfigureAction extends Action {
	type: "configure";
	configuration: Partial<Configuration>;
}

export interface GlobalSetupAction extends Action {
	type: "global-setup";
	cb: AnyCB;
}

export interface GlobalTeardownAction extends Action {
	type: "global-teardown";
	cb: AnyCB;
}

// Errors

export class ConfigError extends Error {
	constructor(optionName: string, message: string) {
		super(`Option '${optionName}': ${message}`);
		this.name = "Config Error";
	}
}

export class InputError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "Input Error";
	}
}

// Guards

// Action guards
export const isHookAction = (action: Action): action is SetHookAction => {
	return action.type === "setHook";
};

export const isItAction = <T extends any[]>(
	action: Action
): action is ItAction<T> => {
	return action.type === "it";
};

export const isDescribeAction = <T extends any[]>(
	action: Action
): action is DescribeAction<T> => {
	return action.type === "describe";
};

export const isDescribeStartAction = (
	action: Action
): action is DescribeStartAction => {
	return action.type === "describe-start";
};

export const isDescribeEndAction = (
	action: Action
): action is DescribeEndAction => {
	return action.type === "describe-end";
};

export const isConfigurationAction = (
	action: Action
): action is ConfigureAction => {
	return action.type === "configure";
};

export const isDoOnceAction = (action: Action): action is DoOnceAction => {
	return action.type === "doOnce";
};

export const isFileStartAction = (
	action: Action
): action is FileStartAction => {
	return action.type === "file-start";
};

export const isFileEndAction = (action: Action): action is FileEndAction => {
	return action.type === "file-end";
};

export const isGroupStartAction = (
	action: Action
): action is GroupStartAction => {
	return isFileStartAction(action) || isDescribeStartAction(action);
};

export const isGroupEndAction = (action: Action): action is GroupEndAction => {
	return isFileEndAction(action) || isDescribeEndAction(action);
};

export const isGlobalSetupAction = (
	action: Action
): action is GlobalSetupAction => {
	return action.type === "global-setup";
};

export const isGlobalTeardownAction = (
	action: Action
): action is GlobalTeardownAction => {
	return action.type === "global-teardown";
};

export const isGlobalAction = (
	action: Action
): action is GlobalTeardownAction | GlobalSetupAction => {
	return isGlobalSetupAction(action) || isGlobalTeardownAction(action);
};
