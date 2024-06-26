import { protectedProcedure } from "@/lib/trpc/server";
import { wrap } from "@/lib/validations/wrap";
import { AiSessionList } from "@/server/api/routers/ai/types/session";
import { TRPCError } from "@trpc/server";
import { maxValue, minValue, number, object, optional } from "valibot";

import { pool } from "../pool";

export const recentSessionsApi = protectedProcedure
	.input(
		wrap(
			object({
				cursor: optional(number(), 0),
				limit: optional(number([minValue(1), maxValue(100)]), 50),
			})
		)
	)
	.query(async ({ ctx, input }) => {
		const user_id = ctx.session?.user.id;

		const result = await pool
			.request({
				method: "GET",
				path: "/sessions/tab/recent",
				query: {
					limit: input.limit,
					offset: input.cursor,
					user_id: user_id ?? "",
				},
			})
			.then(async (res) => {
				return res.body.json() as Promise<AiSessionList>;
			})
			.catch((err) => {
				throw new TRPCError({
					cause: err,
					code: "INTERNAL_SERVER_ERROR",
					message: "服务器内部错误",
				});
			});

		return {
			nextCursor: input.cursor + input.limit,
			result,
		};
	});
