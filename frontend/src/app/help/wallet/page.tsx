import { TypographyStylesProvider } from "@mantine/core";

export default function Page() {
	return (
		<TypographyStylesProvider>
			<div
				dangerouslySetInnerHTML={{
					__html: `
					<h1>OpenAgent 执行器</h1>
					<h2>什么是 OpenAgent 执行器？</h2>
`,
				}}
			></div>
		</TypographyStylesProvider>
	);
}
