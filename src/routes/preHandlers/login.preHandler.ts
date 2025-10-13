import { getAuth } from "@clerk/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { logError } from "@/configs/log.config.js";

export const loginPreHandler = (
	request: FastifyRequest,
	reply: FastifyReply,
): void => {
	try {
		// Use Clerk middleware to get auth
		const { isAuthenticated } = getAuth(request);

		// if user is not authenticated
		if (!isAuthenticated) {
			throw new Error("Unauthorized : from login preHandler");
		}
	} catch (error: unknown) {
		logError("Unauthorized : from login preHandler", error);
		reply.log.error(error);
		reply.status(401).send({ error: `${error} : from login preHandler : ` });
	}
};

// export const postmanLoginPreHandler = async (
//   request: FastifyRequest,
//   reply: FastifyReply
// ): Promise<void> => {
//   try {
//     const body = request.body as { email: string; password: string; platform: string };

//     // Find user
//     const existingUsers = await clerk.users.getUserList({ emailAddress: [body.email] });
//     let user = existingUsers.data[0];
//     if (!user) {
//       logger.info(`Creating test user: ${body.email}`);
//       user = await clerk.users.createUser({
//         emailAddress: [body.email],
//         password: body.password,
//       });
//     }
//   } catch (error) {
//     reply.log.error(error);
//     reply.status(401).send({ error: `${error} : from login preHandler : ` });
//   }
// };
