import { IconLogo } from "@/components/icons";
import { auth } from "@/lib/auth";
import { IconArrowLeft } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { UserAuthForm } from "./user-auth-form.client";

export const metadata: Metadata = {
	description: "登录你的账户",
	title: "登录",
};

// million-ignore
export default async function Page({
	searchParams,
}: {
	searchParams?: { from?: string };
}) {
	const session = await auth();
	if (session) {
		redirect(searchParams?.from ?? "/app");
	}

	return (
		<div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
			<Link className="absolute left-4 top-4 md:left-8 md:top-8" href="/">
				<>
					<IconArrowLeft className="mr-2 size-4" />
					返回
				</>
			</Link>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
				<div className="flex flex-col space-y-2 text-center">
					<IconLogo className="mx-auto size-10" />
					<h1 className="text-2xl font-semibold tracking-tight">
						欢迎来到 OpenAgent
					</h1>
					<p className="text-sm">
						输入电子邮件地址以登录你的账户，
						<br />
						如果没有账户，我们会为你创建。
					</p>
				</div>
				<UserAuthForm />
				{/* <p className="px-8 text-center text-sm text-muted-foreground">
					<Link
						href="/register"
						className="hover:text-brand underline underline-offset-4"
					>
						Don&apos;t have an account? Sign Up
					</Link>
				</p> */}
			</div>
		</div>
	);
}
