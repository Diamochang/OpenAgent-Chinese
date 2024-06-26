"use client";

import { userAuthSchema } from "@/lib/validations/auth";
import { valibotResolver } from "@/lib/validations/resolver";
import { Box, Button, Divider, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
	IconBrandDiscord,
	IconBrandGoogle,
	IconMail,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "valibot";

type FormData = Input<typeof userAuthSchema>;

export function UserAuthForm() {
	const form = useForm<FormData>({
		initialValues: {
			email: "",
		},
		validate: valibotResolver(userAuthSchema),
	});

	const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
	const [isDiscordLoading, setIsDiscordLoading] = useState<boolean>(false);
	const searchParams = useSearchParams();

	const isLoading = isEmailLoading || isDiscordLoading || isGoogleLoading;

	async function handleSubmitEmail(values: FormData) {
		setIsEmailLoading(true);

		const signInResult = await signIn("email", {
			callbackUrl: searchParams?.get("from") || "/app",
			email: values.email.toLowerCase(),
			redirect: false,
		});

		setIsEmailLoading(false);

		if (!signInResult?.ok) {
			return notifications.show({
				message: "你的登录请求失败。请再试一次。",
				title: "啊哦，出问题了",
				variant: "error",
			});
		}

		return notifications.show({
			message: "我们向你发送了包含登录链接的电子邮件。请不要忘了检查垃圾邮件箱。",
			title: "检查你的邮箱",
		});
	}

	return (
		<Box mx="auto" px="xs" w="100%">
			<form onSubmit={form.onSubmit(handleSubmitEmail)}>
				<TextInput
					autoCapitalize="none"
					autoComplete="email"
					autoCorrect="off"
					disabled={isLoading}
					id="email"
					placeholder="name@example.com"
					size="lg"
					type="email"
					{...form.getInputProps("email")}
				/>

				<Button
					className="mt-3"
					disabled={isLoading}
					fullWidth
					loaderProps={{ type: "dots" }}
					loading={isEmailLoading}
					size="lg"
					type="submit"
				>
					<IconMail />
					&nbsp; 使用电子邮件继续
				</Button>
			</form>

			<Divider label="OR" labelPosition="center" my="xs" />

			<Stack>
				<Button
					color="gray"
					disabled={isLoading}
					fullWidth
					loaderProps={{ type: "dots" }}
					loading={isGoogleLoading}
					onClick={() => {
						setIsGoogleLoading(true);
						signIn("google");
					}}
					size="lg"
				>
					<IconBrandGoogle />
					&nbsp; 使用 Google 继续
				</Button>

				<Button
					color="gray"
					disabled={isLoading}
					fullWidth
					loaderProps={{ type: "dots" }}
					loading={isDiscordLoading}
					onClick={() => {
						setIsDiscordLoading(true);
						signIn("discord");
					}}
					size="lg"
				>
					<IconBrandDiscord />
					&nbsp; 使用 Discord 继续
				</Button>
			</Stack>
		</Box>
	);
}
