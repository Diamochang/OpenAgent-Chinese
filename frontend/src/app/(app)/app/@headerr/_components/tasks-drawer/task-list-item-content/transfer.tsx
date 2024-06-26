import {
	ExecutorAddressDisplay,
	ExecutorAddressFromIdDisplay,
} from "@/components/executor/executor-address-display";
import { Group, Image, Text, rem } from "@mantine/core";

import { Label } from "./basics/label";
import { TxHash } from "./basics/tx-hash";

export function TaskListItemContentTransfer({
	task,
}: {
	task: AiTaskItem<"transfer">;
}) {
	return (
		<>
			<Group>
				<Label>发送者</Label>
				<ExecutorAddressFromIdDisplay executorId={task.body.executor_id} />
			</Group>
			<Group>
				<Label>接收者</Label>
				<ExecutorAddressDisplay executorAddress={task.body.to_address} />
			</Group>
			<Group>
				<Label>金额</Label>
				<Group gap="xs">
					<Image
						alt="代币标志"
						h={rem(16)}
						src={task.body.logoURI}
						w={rem(16)}
					/>
					<Text ff="monospace" span>
						{task.body.amount}
					</Text>
					<Text span>{task.body.token}</Text>
				</Group>
			</Group>
			{task.hash && (
				<Group>
					<Label>哈希值</Label>
					<TxHash hash={task.hash} />
				</Group>
			)}
		</>
	);
}
