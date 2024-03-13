import mongoose from "mongoose";
import { User } from "./userSchema";
import { compare, hash } from "bcryptjs"
import { ProfileImage } from "./profileImageSchema";

const MONGODB_URL = process.env.MONGODB_URL as string
try {
    mongoose.connect(MONGODB_URL); //Connected to DB.

} catch (error) {
    console.log(error);

}

/**
 * DB operations' "Static Class".
 */
export class DBService {

    /**Checks if any user exists with spesific email. If it is returns true, else false. */
    public static async checkIfEmailExists(email: string): Promise<boolean | Error> {
        try {
            const userId = await User.exists({ email });
            return userId ? true : false;
        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Checks if any google user exists with spesific email. If it is, returns the user's document. */
    public static async checkIfGoogleUserExists(email: string) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    public static async createCredentialUser(email: string, hashedPassword: string) {
        try {
            const user = await User.create({
                email,
                password: hashedPassword,
                role: "credentialUser",
            });
            return user

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    public static async createGoogleUser(email: string, name: string | undefined, imageURL: string) {
        try {
            const user = await User.create({
                email,
                name,
                image: { URL: imageURL },
                role: "googleUser"
            });
            return user

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Validates credentials. If they are correct returns user else null*/
    public static async validateCredentials(email: string, password: string) {
        try {
            const user = await User.findOne({ email });

            if (user) {
                const passwordMatches = await compare(password, user.password);
                return passwordMatches ? user : null
            }

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Gets user from DB and returns. If there is no user, returns null.*/
    public static async getUserById(userId: string) {
        try {
            const user = await User.findById(userId);
            return user

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**
     * Retrieves a specific batch of users from the database.
     * @param batchSize The size of each batch, i.e., the number of users to fetch per batch.
     * @param batchNumber The batch number, specifying which batch of users to retrieve (starting from 1).
     * @returns A promise that resolves to an array of user documents for the specified batch.
     */
    public static async getUsersByBatch(batchSize: number, batchNumber: number) {
        try {
            const users = await User.find()
                .limit(batchSize) // Limit the number of documents returned per batch
                .skip(batchNumber * batchSize); // Skip documents from previous batches

            return users

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Updates user documnet by given user profile update object.*/
    public static async updateUserProfile(userId: string, updateData: IProfileUpdateDBData) {

        try {
            const userDocument = await User.findById(userId);
            if (!userDocument) return null; //User not found

            let result = userDocument;

            userDocument.name = updateData.name;
            userDocument.birthday = updateData.birthday;

            if (userDocument.email !== updateData.email) {
                if (userDocument.role === "googleUser") { //Can't change Google User's email.
                    result = "email not changed";

                } else {
                    const emailExist = await this.checkIfEmailExists(updateData.email);
                    if (!emailExist) { //Email can be updated.
                        userDocument.email = updateData.email;
                        userDocument.email_verified = false;
                    } else {
                        result = "email not changed";
                    }

                }
            }

            await userDocument.save();
            return result;

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Returns
     * -"success": Password is chnaged succesfully.
     * -"wrongPass": oldPassword is wrong.
     * -null: User not found.
     * -Error: An error occurred.
     *  */
    public static async changeUserPassword(userId: string, oldPassword: string, newPassword: string): Promise<"success" | "wrongPass" | null | Error> {
        try {
            const user = await User.findById(userId);
            if (!user) return null;

            const isPasswordCorrect = await compare(oldPassword, user.password);
            if (!isPasswordCorrect) return "wrongPass";

            const newPasswordHash = await hash(newPassword, 10);
            user.password = newPasswordHash;
            user.save();
            return "success"

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Adds email verification token(JWT) to user document.*/
    public static async addEmailVerificationToken(userId: string, token: string): Promise<"success" | null | Error> {
        try {
            const result = await User.updateOne({ _id: userId }, { email_verfication_token: token });

            if (!result || !result.acknowledged) throw Error("A DB error occurred.");
            if (result.matchedCount === 0) return null //User not found. 

            return "success"

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Returns user's email verification token, if it exists.*/
    public static async getEmailVerificationToken(userId: string): Promise<string | null | Error> {
        try {
            const user = await User.findById(userId);
            if (!user) return null;
            if (!user.email_verfication_token) return "token does not exist";
            return user.email_verfication_token;

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Set user's 'email_verified' field to 'true'*/
    public static async verifyEmail(userId: string) {
        try {
            const user = await User.findByIdAndUpdate(userId, { email_verified: true }, { returnOriginal: false });
            if (!user) return null;
            return "success"
        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Checks if user exists with given email. If it is, adds reset password token to user document.*/
    public static async handleForgotPasswordDBOperations(email: string, token: string): Promise<"success" | null | Error> {
        try {
            const user = await User.findOne({ email });
            if (!user) return null;

            user.reset_pasword_token = token;
            user.save();
            return "success"

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Compares tokens, if matches, resets password. Returns null if user not found. */
    public static async handleResetPasswordDBOperations(email: string, token: string, newPassword: string): Promise<string | null | Error> {
        try {
            const user = await User.findOne({ email });
            if (!user) return null;
            if (!user.reset_pasword_token) return "token does not exist";
            if (user.reset_pasword_token !== token) return "tokens dont match";

            const newPasswordHash = await hash(newPassword, 10);
            user.password = newPasswordHash;
            user.save();

            return "success"

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    public static async getResetPasswordToken(email: string): Promise<string | null | Error> {
        try {
            const user = await User.findOne({ email });
            if (!user) return null;
            if (!user.reset_pasword_token) return "token does not exist";
            return user.reset_pasword_token

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    public static async resetUserPassword(userId: string, oldPassword: string, newPassword: string): Promise<"success" | "wrongPass" | null | Error> {
        try {
            const user = await User.findById(userId);
            if (!user) return null;

            const isPasswordCorrect = await compare(oldPassword, user.password);
            if (!isPasswordCorrect) return "wrongPass";

            const newPasswordHash = await hash(newPassword, 10);
            user.password = newPasswordHash;
            user.save();
            return "success"

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Bans or unbans the user if it exists. */
    public static async banUnbanUser(userId: string) {
        try {
            const user = await User.findById(userId);
            if (!user) return null;

            user.banned = !user.banned;
            await user.save();
            return "success";

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Returns total user count. */
    public static async getUserCount() {
        try {
            const userCount = await User.countDocuments();
            return userCount;

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

    /**Uploads profile image to DB 'profileimages' collection/bucket.*/
    public static async uploadProfileImageToDB(userId: string, imageBuffer: Buffer) {
        try {
            const imageDocument = new ProfileImage({ userId, imageData: imageBuffer });
            const result = await imageDocument.save();
            return result._id.toString() as string;

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }
    /**Set user document's image attribute to profile image's corresponding URL. */
    public static async setProfileImageURL(userId: string, imageURL: string) {
        try {
            const user = await User.findByIdAndUpdate(userId, { image: imageURL }, { returnOriginal: false });
            if (!user) return null;
            return "success"

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }


    public static async handleProfileImageChanging(userId: string, imageBuffer: Buffer, mimeType: string) {
        try {
            const user = await User.findById(userId);
            if (!user) return null; //User not found.

            let imageId: string | undefined;
            let imageURL: string | undefined;

            //If there was an image uploaded...
            if (user.image && user.image.documentRef) {
                imageId = user.image.documentRef.toString();
                imageURL = `http://localhost:3000/api/profile/image/${imageId}`

                await ProfileImage.findByIdAndUpdate(imageId,
                    { imageData: imageBuffer, mimeType },
                    { returnOriginal: false });

            } else {
                //There was or either not an user image attribute but it was not stored at the DB...
                const image = new ProfileImage({ userId, imageData: imageBuffer, mimeType });
                const result = await image.save();
                imageId = result._id.toString() as string;
                imageURL = `http://localhost:3000/api/profile/image/${imageId}`
                user.image = {
                    URL: imageURL,
                    documentRef: imageId
                }
                await user.save();
            }

            return imageURL; //We get profile images by their ids.

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }


    public static async getProfileImageDocument(imageId: string) {
        try {
            const imageDocument = await ProfileImage.findById(imageId);
            if (!imageDocument) return null; //Image not found.            
            return imageDocument;

        } catch (error: Error | any) {
            console.log(error);
            return error
        }
    }

}