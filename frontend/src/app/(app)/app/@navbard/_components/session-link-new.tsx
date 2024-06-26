"use client";

import { useAiNewSessionRouter } from "@/lib/ai/hooks";
import { NavLink, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export function SessionLinkNew() {
	const { isNewSession, pushNewSession } = useAiNewSessionRouter();

	const handleClick = () => {
		pushNewSession();
	};

	return (
		<NavLink
			active={isNewSession}
			// label={session.title ?? session.session_id + "12312312312312"}
			label={<Text truncate="end">新建对话</Text>}
			leftSection={<IconPlus size="1.25rem" />}
			onClick={handleClick}
			title={"新建对话"}
		/>
	);
}
