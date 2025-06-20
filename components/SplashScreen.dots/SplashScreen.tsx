import {
	useEffect,
	useState,
	type CSSProperties,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react";

import "./SplashScreen.css";

export interface SplashScreenHandle {
	hide: () => void;
}

interface SplashScreenProps {
	minDurationMs?: number;
	onHidden?: () => void; // Callback when fully hidden and removed
}

const SplashScreen = forwardRef<SplashScreenHandle, SplashScreenProps>(
	({ minDurationMs = 0, onHidden }, ref) => {
		const [status, setStatus] = useState<"pending" | "visible" | "hiding" | "hidden">("pending");
		const elementRef = useRef<HTMLDivElement>(null);
		const renderedAtRef = useRef<number>(0);
		const cssBlock = "SplashScreen"; // BEM Block name, also used for URL param

		useEffect(() => {
			renderedAtRef.current = new Date().getTime();
			const url = new URL(window.location.href);
			const urlParams = new URLSearchParams(url.search);
			const param = urlParams.get(cssBlock); // Check for ?SplashScreen=false

			let shouldBeVisible = true;
			if (param === "false") {
				shouldBeVisible = false;
			}

			if (param) {
				urlParams.delete(cssBlock);
				url.search = urlParams.toString();
				window.history.replaceState({}, "", url.toString());
			}

			setStatus(shouldBeVisible ? "visible" : "hidden");
		}, [cssBlock]);

		useImperativeHandle(ref, () => ({
			async hide() {
				if (status !== "visible" || !elementRef.current) return;

				const elapsedTime = new Date().getTime() - renderedAtRef.current;
				const remainingTime = Math.max(minDurationMs - elapsedTime, 0);

				if (remainingTime > 0) {
					await new Promise((resolve) => setTimeout(resolve, remainingTime));
				}
				setStatus("hiding");
			},
		}));

		useEffect(() => {
			const element = elementRef.current;
			if (status === "hiding" && element) {
				const handleAnimationEnd = (event: AnimationEvent) => {
					if (event.animationName === `${cssBlock}-hide`) {
						setStatus("hidden");
						onHidden?.();
						element.removeEventListener("animationend", handleAnimationEnd as EventListener);
					}
				};
				element.addEventListener("animationend", handleAnimationEnd as EventListener);
				element.classList.add(`${cssBlock}--hidden`); // Trigger animation

				return () => {
					element.removeEventListener("animationend", handleAnimationEnd as EventListener);
				};
			}
		}, [status, cssBlock, onHidden]);

		if (status === "hidden" || status === "pending") {
			return null;
		}

		return (
			<>
				<div
					className={cssBlock}
					ref={elementRef}
					style={{ visibility: "visible" } as CSSProperties} // Made visible by JS when status is 'visible'
				>
					<div className={`${cssBlock}__loader`}>
						<div className={`${cssBlock}__dot`}></div>
						<div className={`${cssBlock}__dot`}></div>
						<div className={`${cssBlock}__dot`}></div>
						<div className={`${cssBlock}__dot`}></div>
					</div>
				</div>
			</>
		);
	}
);

SplashScreen.displayName = "SplashScreen";
export default SplashScreen;
