import { relations } from "drizzle-orm/relations";
import { user, session, shibaSubmission } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	shibaSubmissions: many(shibaSubmission),
}));

export const shibaSubmissionRelations = relations(shibaSubmission, ({one}) => ({
	user: one(user, {
		fields: [shibaSubmission.userId],
		references: [user.id]
	}),
}));