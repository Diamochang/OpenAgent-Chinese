"use client";

import { Burger, Tooltip } from "@mantine/core";
import { atom, useAtom } from "jotai";

const atomBurgerOpenDesktop = atom<boolean>(true);
const atomBurgerOpenMobile = atom<boolean>(false);

export function useBurgerOpen() {
	const desktop = useAtom(atomBurgerOpenDesktop);
	const mobile = useAtom(atomBurgerOpenMobile);
	return {
		desktop,
		mobile,
	};
}

export function LayoutBurger() {
	const { desktop, mobile } = useBurgerOpen();

	return (
		<>
			{/* mobile */}
			<Tooltip
				label={mobile[0] ? "关闭导航栏" : "打开导航栏"}
				openDelay={500}
			>
				<Burger
					aria-label="展开导航"
					hiddenFrom="sm"
					onClick={(e) => {
						e.stopPropagation();
						mobile[1]((o) => !o);
					}}
					opened={mobile[0]}
					size="sm"
				/>
			</Tooltip>

			{/* desktop */}
			<Tooltip
				label={desktop[0] ? "关闭导航栏" : "打开导航栏"}
				openDelay={500}
			>
				<Burger
					aria-label="展开导航"
					hidden={desktop[0]}
					onClick={(e) => {
						e.stopPropagation();
						desktop[1]((o) => !o);
					}}
					opened={desktop[0]}
					size="sm"
					visibleFrom="sm"
				/>
			</Tooltip>
		</>
	);
}
