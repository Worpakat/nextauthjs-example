import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DBService } from "@/db_service/db_service";

export const options: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {},

            authorize: async (credentials) => {
                if (!credentials) return null;

                const { email, password } = credentials as {
                    email: string | undefined,
                    password: string | undefined,
                };
                if (!email || !password) return null;

                const validationResult = await DBService.validateCredentials(email, password);
                if (!validationResult || validationResult instanceof Error) return null; //Credentials not valid or an error occurred.
                //MAKE AN ERROR PAGE AND THROW THE ERROR!!!

                return {
                    id: validationResult._id.toString(),
                    email: validationResult.email,
                    email_verified: validationResult.email_verified,
                    role: validationResult.role,
                    imageURL: validationResult.image ? validationResult.image.URL : undefined
                }
            }
        }),

        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

            profile: async (profile) => {
                let userDocument

                const userResult = await DBService.checkIfGoogleUserExists(profile.email);
                if (userResult instanceof Error) throw Error;
                if (userResult) userDocument = userResult;

                if (!userResult) { //If user already exists, we don't create new one.
                    const result = await DBService.createGoogleUser(profile.email, profile.name, profile.picture);
                    if (!result || result instanceof Error) throw Error;
                    userDocument = result;
                }

                return {
                    id: userDocument._id.toString(),
                    email: userDocument.email,
                    email_verified: userDocument.email_verified,
                    role: userDocument.role,
                    imageURL: userDocument.image ? userDocument.image.URL : undefined
                }
            }
        })
    ],

    callbacks: {
        jwt({ user, token, trigger, session }) {
            if (user) { //User is passed just first authentication/signin process.
                token.id = user.id;
                token.role = user.role;
                token.picture = user.imageURL;
                token.email_verified = user.email_verified;
            }

            if (trigger === "update") {
                if ('email_verified' in session) {                     
                    token.email_verified = session.email_verified;
                }
                if ('email' in session) {
                    token.email = session.email;
                }
                if ('imageURL' in session) {
                    token.picture = session.imageURL
                }
            }

            return token
        },
        session({ token, session }) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.imageURL = token.picture ? token.picture : undefined
            session.user.email_verified = token.email_verified

            return session
        },
    },
    pages: {
        signIn: '/signin',
        error: '/auth-error', // Error code passed in query string as ?error=
    }
}