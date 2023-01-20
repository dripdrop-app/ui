import { useCallback, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSetState } from '@mantine/hooks';
import { isEqual } from 'lodash';

type ParamValue = string | number | string[] | boolean;

const useSearchParams = <T extends Record<string, ParamValue>>(initial: T) => {
	const initialRef = useRef(initial);
	const [state, setState] = useSetState(initial);

	const history = useHistory();
	const location = useLocation();

	// Syncs state from search params
	useEffect(() => {
		const currentSearchParams = new URLSearchParams(location.search);
		const initial = state;
		const update = {} as Partial<T>;
		for (const key in initial) {
			const param = currentSearchParams.get(key);
			const initialValue = initial[key];
			if (param) {
				if (typeof initialValue === 'string') {
					if (initialValue !== param) {
						(update[key] as string) = param;
					}
				} else if (typeof initialValue === 'number') {
					const parsedParam = parseInt(param);
					if (initialValue !== parsedParam) {
						(update[key] as number) = parsedParam;
					}
				} else if (typeof initialValue === 'boolean') {
					const parsedParam = parseInt(param) === 1;
					if (initialValue !== parsedParam) {
						(update[key] as boolean) = parsedParam;
					}
				} else if (Array.isArray(initialValue)) {
					const parsedParam = param.split(',');
					if (!isEqual(initialValue, parsedParam)) {
						(update[key] as string[]) = parsedParam;
					}
				}
			} else {
				if (!isEqual(initial[key], initialRef.current[key])) {
					update[key] = initialRef.current[key];
				}
			}
		}
		if (Object.keys(update).length !== 0) {
			setState(update);
		}
	}, [location.search, setState, state]);

	const setSearchParams = useCallback(
		(newSearchParams: Partial<T>) => {
			const currentSearchParams = new URLSearchParams(window.location.search);
			const initial = state;
			for (const key in newSearchParams) {
				const currentValue = initial[key];
				const newValue = newSearchParams[key];
				if (!isEqual(currentValue, newValue)) {
					if (typeof newValue === 'string') {
						currentSearchParams.set(key, newValue);
					} else if (typeof newValue === 'number') {
						currentSearchParams.set(key, newValue.toString());
					} else if (typeof newValue === 'boolean') {
						currentSearchParams.set(key, newValue ? '1' : '0');
					} else if (Array.isArray(newValue)) {
						if (newValue.length === 0) {
							currentSearchParams.delete(key);
						} else {
							currentSearchParams.set(key, newValue.join(','));
						}
					}
				}
			}
			history.push({ ...location, search: currentSearchParams.toString() });
		},
		[history, location, state]
	);

	return { params: state, setSearchParams };
};

export default useSearchParams;
