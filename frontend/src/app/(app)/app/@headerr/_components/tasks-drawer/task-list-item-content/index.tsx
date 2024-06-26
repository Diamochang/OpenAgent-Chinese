import dynamic from "next/dynamic";

import { isTaskTypeOf } from "./utils/extractor";

const TaskListItemContentTransfer = dynamic(() =>
	import("./transfer").then((mod) => mod.TaskListItemContentTransfer)
);

export function TaskListItemContent({ task }: { task: AiTaskItem }) {
	if (isTaskTypeOf(task, "transfer")) {
		return <TaskListItemContentTransfer task={task} />;
	} else {
		return <div>未知任务类型</div>;
	}
}
