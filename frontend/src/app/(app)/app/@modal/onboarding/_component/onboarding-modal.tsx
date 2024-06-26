"use client";

import { IconLogo } from "@/components/icons";
import { api } from "@/lib/trpc/client";
import { Button, Text } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";

import { PageModal } from "../../_components/page-modal";

export function OnboardingModal() {
	const utils = api.useUtils();
	const executorCreate = api.executor.executorCreate.useMutation();

	return (
		<PageModal closeOnClickOutside={false}>
			{({ close }) => (
				<>
					<Text my="md">
						你好！欢迎使用 <IconLogo className="align-middle" size="1rem" />{" "}
						OpenAgent。
					</Text>

					<Text my="md">
					OpenAgent 可帮助你管理加密资产并跟踪你的
					投资组合。
					</Text>

					<Text my="md">
						让我们开始吧，只需轻轻一点，就能设置你的第一个{" "}
						<IconWallet className="align-middle" size="1rem" />
						<Text fw={700} span>
							执行器
						</Text>{" "}
						。
					</Text>

					<Button
						fullWidth
						loading={executorCreate.isPending}
						mt="md"
						onClick={() =>
							executorCreate.mutate(undefined, {
								onSuccess: async () => {
									await utils.executor.executors.invalidate();
									close();
								},
							})
						}
						size="md"
					>
						创建执行器
					</Button>

					<Button
						disabled={executorCreate.isPending}
						fullWidth
						mt="sm"
						onClick={() => close()}
						size="md"
						variant="subtle"
					>
						稍后创建
					</Button>

					<Text my="sm" size="xs">
						* 你可以稍后在设置页面创建执行器。
					</Text>
				</>
			)}
		</PageModal>
	);
}
