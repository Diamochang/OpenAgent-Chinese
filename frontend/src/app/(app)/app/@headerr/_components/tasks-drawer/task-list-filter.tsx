"use client";

import { SegmentedControl } from "@mantine/core";
import { atom, useAtom } from "jotai";

const taskActiveTabAtom = atom<"all" | "current">("current");

export function useTaskActiveTab() {
	const [activeTab, setActiveTab] = useAtom(taskActiveTabAtom);

	return {
		activeTab,
		setActiveTab,
	};
}

export function TaskListFilter() {
	const { activeTab, setActiveTab } = useTaskActiveTab();

	return (
		<SegmentedControl
			className="flex-1"
			data={[
				{ label: "当前对话", value: "current" },
				{ label: "全部对话", value: "all" },
			]}
			fullWidth
			onChange={(e) => setActiveTab(e as any)}
			value={activeTab}
		/>
	);
}
