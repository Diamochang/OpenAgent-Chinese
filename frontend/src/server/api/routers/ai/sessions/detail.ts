import { protectedProcedure } from "@/lib/trpc/server";
import { wrap } from "@/lib/validations/wrap";
import {
	AiSession,
	AiSessionErrorResponse,
} from "@/server/api/routers/ai/types/session";
import { TRPCError } from "@trpc/server";
import {
	maxValue,
	minValue,
	number,
	object,
	optional,
	string,
	uuid,
} from "valibot";

import { pool } from "../pool";

export const detailSessionApi = protectedProcedure
	.input(
		wrap(
			object({
				cursor: optional(number(), 0),
				limit: optional(number([minValue(1), maxValue(100)]), 50),
				sessionId: string([uuid()]),
			})
		)
	)
	.query(async ({ ctx, input }) => {
		const user_id = ctx.session.user.id;

		const result = await pool
			.request({
				method: "GET",
				path: `/sessions/${user_id}/${input.sessionId}`,
				query: {
					limit: input.limit,
					offset: input.cursor,
				},
			})
			.then(async (res) => {
				if (res.statusCode === 200) {
					return res.body.json() as Promise<AiSession>;
				} else if (res.statusCode === 400) {
					const errorRes = (await res.body.json()) as AiSessionErrorResponse;
					if (errorRes.message === "Not found") {
						return {
							messages: [],
							title: null,
						} as AiSession;
					}
				}
				console.log(res.statusCode);
				return {
					messages: [],
					title: null,
				} as AiSession;
			})
			.catch(async (err) => {
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
