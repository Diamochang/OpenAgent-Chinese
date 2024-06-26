import { NavLink } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";

export function Settings() {
	return (
		<NavLink
			// classNames={{
			// 	root: "py-1",
			// }}
			component={Link}
			href="/app/settings"
			label="设置"
			leftSection={<IconSettings size="1rem" stroke={1.5} />}
			scroll={false}
		/>
	);
}
