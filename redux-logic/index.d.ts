// Type definitions for redux-logic 0.9.3
// Project: https://github.com/jeffbski/redux-logic
// Definitions by: Takayuki Yoshizawa <https://github.com/rchaser53>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'redux-logic' {
	import * as Redux from 'redux';
	import * as Rx from 'rx';

	export function createLogic<A, T>(option: logicOption<A, T>): ReduxLogic<A>;
	export function createLogicMiddleware<A>(logic: ReduxLogic<A>[], deps: LogicDependency) : Redux.Middleware;

	export interface logicOption<A, T> {
		type: string | string[];
		cancelType?: string | string[];
		debounce?: number;
		throttle?: number;
		latest?: boolean;
		validate?: validate;
		transform?: validate;

		// options influencing the process hook, defaults to {}
		processOptions?: {
			dispatchReturn: boolean;
			successType?: string | Redux.ActionCreator<A>; // default undefined
			failType?: string | Redux.ActionCreator<A>; // default undefined
		};

		// If validate/transform reject was used then this hook will not be
		// executed. Call dispatch exactly once or read the advanced api about
		// performing multiple dispatches
		process: <T>(validateObj: LogicDependency, dispatch: Redux.Dispatch<T>)
						=> Redux.Action | Promise<T> | Rx.Observable<T>;
	}

	type validate = <A>(validateObj: LogicDependency,
					allow: (action: Redux.Action | Redux.ActionCreator<A>) => void,
					reject: (action: Redux.Action | Redux.ActionCreator<A>) => void ) => void;

	interface ReduxLogic<A> {
		name: string | string[];
		type: string | string[];
		cancelType: string | string[];
		latest: boolean;
		debounce: number;
		throttle: number;
		validate: (...arg) => boolean;
		transform: (...arg) => boolean;
		process: {
			(dependency: LogicDependency, dispatch: Redux.Dispatch<S> ):void;
		},
		processOptions: {
			dispatchReturn: boolean;
			successType: string | Redux.Action | Redux.ActionCreator<A>;
			failType: string | Redux.Action | Redux.ActionCreator<A>;
		};
	}

	export interface LogicDependency {
		getState: () => any;
		action: Redux.Action;
		[key: string]: any;
	}
}