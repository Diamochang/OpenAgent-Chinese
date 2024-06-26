import type { ReactNode } from "react";

import { Box, Text, rem } from "@mantine/core";
import {
	IconActivity,
	IconBrandAppstore,
	IconCurrencyEthereum,
	IconFlame,
	IconGasStation,
	IconLineHeight,
	IconMoodSmile,
	IconQuestionMark,
	IconSearch,
	IconUser,
	IconUsersGroup,
} from "@tabler/icons-react";

import { QuestionCards } from "./question-cards";

const Bold = ({ children }: { children: ReactNode }) => (
	<Text fw="bold" span>
		{children}
	</Text>
);

const iconStyle = { height: rem(24), width: rem(24) };

const suggestedQuestions = [
	{
		icon: <IconCurrencyEthereum style={iconStyle} />,
		plaintext: "告诉我关于以太坊的信息。",
		question: (
			<>
				告诉我关于<Bold>以太坊</Bold>的信息。
			</>
		),
	},
	{
		icon: <IconCurrencyEthereum style={iconStyle} />,
		plaintext: "当前 ETH 的价格是多少？",
		question: (
			<>
				当前 <Bold>ETH</Bold> 的价格是多少？
			</>
		),
	},
	{
		icon: <IconFlame style={iconStyle} />,
		plaintext: "你能列出一些热门代币吗？",
		question: (
			<>
				你能列出一些<Bold>热门代币</Bold>吗？
			</>
		),
	},
	{
		icon: <IconFlame style={iconStyle} />,
		plaintext: "你能列出一些热门 NFT 吗？",
		question: (
			<>
				你能列出一些<Bold>热门 NFT</Bold> 吗？
			</>
		),
	},
	{
		icon: <IconActivity style={iconStyle} />,
		plaintext: "vitalik.eth 最近有什么动态？",
		question: (
			<>
				<Bold>vitalik.eth</Bold> 最近有什么动态？
			</>
		),
	},
	{
		icon: <IconLineHeight style={iconStyle} />,
		plaintext: "当前区块高度是多少？",
		question: (
			<>
				当前<Bold>区块高度</Bold>是多少？
			</>
		),
	},
	{
		icon: <IconGasStation style={iconStyle} />,
		plaintext: "当前燃料费价格是多少？",
		question: (
			<>
				当前<Bold>燃料费价格</Bold>是多少？
			</>
		),
	},
	{
		icon: <IconUsersGroup style={iconStyle} />,
		plaintext: "列出以太坊上最活跃的用户。",
		question: (
			<>
				列出以太坊上<Bold>最活跃的用户</Bold>。
			</>
		),
	},
	{
		icon: <IconQuestionMark style={iconStyle} />,
		plaintext: "Arbitrum 和以太坊之间的区别是什么？",
		question: (
			<>
				<Bold>Arbitrum</Bold> 和<Bold>以太坊</Bold>之间的区别是什么？
			</>
		),
	},
	{
		icon: <IconQuestionMark style={iconStyle} />,
		plaintext: "我如何获取一些 ETH？",
		question: (
			<>
				我如何获取一些 <Bold>ETH</Bold>？
			</>
		),
	},
	{
		icon: <IconBrandAppstore style={iconStyle} />,
		plaintext: "以太坊上顶级的去中心化应用有哪些？",
		question: (
			<>
				以太坊上顶级的<Bold>去中心化应用</Bold>有哪些？
			</>
		),
	},
	{
		icon: <IconSearch style={iconStyle} />,
		plaintext: "列出一些总锁定价值最高的去中心化金融项目。",
		question: (
			<>
				列出一些总锁定价值最高的<Bold>去中心化金融项目</Bold>。
			</>
		),
	},
	{
		icon: <IconUser style={iconStyle} />,
		plaintext: "以太坊上的 vitalik.eth 是谁？",
		question: (
			<>
				以太坊上的 <Bold>vitalik.eth</Bold> 是谁？
			</>
		),
	},
	{
		icon: <IconMoodSmile style={iconStyle} />,
		plaintext: "你是谁？",
		question: <>你是谁？</>,
	},
	{
		icon: <IconMoodSmile style={iconStyle} />,
		plaintext: "谁创造了你？",
		question: <>谁创造了你？</>,
	},
];

export function NewSessionGuide({ sessionId }: { sessionId: string }) {
	const randomSixQuestions = suggestedQuestions
		.sort(() => 0.5 - Math.random())
		.slice(0, 6);

	return (
		<Box bottom={rem(80)} pos="absolute" px="md">
			<QuestionCards questions={randomSixQuestions} sessionId={sessionId} />
		</Box>
	);
}
