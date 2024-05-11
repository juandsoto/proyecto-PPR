import { useRef, useState } from "react";

const useInterval = () => {
	const [hasStarted, setHasStarted] = useState<boolean>(false);
	const [elapsedTime, setElapsedTime] = useState<string>('00:00:01');
	const intervalIdRef = useRef<number | null>(null);
	const startTimeRef = useRef<number | null>(null);

	const updateTime = () => {
		const currentTime = new Date().getTime();
		const elapsedTimeInSeconds = Math.floor((currentTime - (startTimeRef.current! ?? new Date().getTime())) / 1000);
		const hours = Math.floor(elapsedTimeInSeconds / 3600);
		const minutes = Math.floor((elapsedTimeInSeconds % 3600) / 60);
		const seconds = elapsedTimeInSeconds % 60;
		setElapsedTime(
			`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
		);
	};

	const startInterval = () => {
		setElapsedTime('00:00:00');
		if (!intervalIdRef.current) {
			startTimeRef.current = new Date().getTime();
			const id = setInterval(updateTime, 1000);
			intervalIdRef.current = id;
			setHasStarted(true);
		}
	};

	const stopInterval = () => {
		clearInterval(intervalIdRef.current!);
		intervalIdRef.current = null;
	};

	return { hasStarted, startInterval, stopInterval, elapsedTime, hide: () => setHasStarted(false) };
};

export default useInterval;