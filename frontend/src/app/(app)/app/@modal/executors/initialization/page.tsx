"use client";

import { api } from "@/lib/trpc/client";
import { Anchor, Button, Flex, Portal, Text } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import { PageModal } from "../../_components/page-modal";

const Confetti = dynamic(() => import("react-confetti"));

export default function Page() {
	const { data: executors, isPending } = api.executor.executors.useQuery();
	const utils = api.useUtils();

	const [showConfetti, setShowConfetti] = useState(false);

	const executorCreate = api.executor.executorCreate.useMutation({
		async onSuccess() {
			await utils.executor.executors.invalidate();
			setShowConfetti(true);
		},
	});

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (showConfetti) {
			setTimeout(() => {
				setShowConfetti(false);
			}, 5000);
		}

		return () => {
			timer && clearTimeout(timer);
		};
	}, [showConfetti]);

	const hasExecutors = executors && executors.length > 0;
	const shouldLoadingBtn = isPending || executorCreate.isPending;

	const renderCreateExecutorScreen = () => {
		return (
			<>
				<Text fw="bold" my="xs">
					🚀 欢迎使用你自己的{" "}
					<Text fw="bolder" span variant="gradient">
						OpenAgent 执行器
					</Text>
					！🌟
				</Text>

				<Text my="xs">
					OpenAgent 执行器是一个{" "}
					<Text fw="bold" span>
						账户抽象（AA）智能合约执行器
					</Text>{" "}
					，是一种更智能、更安全、更便捷的
					区块链交互方式。借助 OpenAgent 的人工智能功能，你可以
					在 Web3 的世界中享受无缝体验。
				</Text>

				<Anchor
					c="dimmed"
					component={Link}
					href="/help/executor"
					my="xs"
					size="xs"
					target="_blank"
				>
					了解更多详情。
				</Anchor>

				{hasExecutors && (
					<Text c="red">
						你已经有一个 OpenAgent 执行器，所以暂时不能再创建
						另一个。
					</Text>
				)}

				<Flex justify="flex-end">
					<Button
						disabled={hasExecutors}
						loading={shouldLoadingBtn}
						onClick={() => {
							executorCreate.mutate();
						}}
					>
						✨ 创建执行器
					</Button>
				</Flex>
			</>
		);
	};

	const renderSuccessScreen = ({ close }: { close: () => void }) => {
		const executor = executors?.[0];
		return (
			<>
				<Text fw="bold" my="xs">
					🎉 祝贺！ 🎉
				</Text>

				<Text my="xs">
					你已成功创建 OpenAgent 执行器。现在你可以
					开始借助人工智能的神力与区块链进行交互！
				</Text>

				{executor && (
					<Text my="xs" size="xs">
						Address:{" "}
						<Text ff="monospace" fw="bold" span>
							{executor.executorAddress}
						</Text>
					</Text>
				)}

				<Flex justify="flex-end">
					<Button
						onClick={() => {
							close();
						}}
					>
						👍 明白了！
					</Button>
				</Flex>
			</>
		);
	};

	return (
		<>
			<PageModal
				title={
					<>
						<IconWallet />
					</>
				}
				withCloseButton
			>
				{({ close }) => {
					if (executorCreate.isSuccess) {
						return renderSuccessScreen({ close });
					}

					return renderCreateExecutorScreen();
				}}
			</PageModal>

			<Portal>
				<div className="fixed left-0 top-0 z-[50000]">
					<Confetti numberOfPieces={showConfetti ? 200 : 0} />
				</div>
			</Portal>
		</>
	);
}
