interface IUserProfile {
    username?: string
    email: string
    email_verified: boolean
    imageURL?: string
    role: string
    banned: boolean
    birthday?: Date | string
}

interface IUserWithId extends IUserProfile {
    id: string;
}

/**Used as profile update objects reference.*/
interface IProfileUpdateDBData {
    name?: string
    email: string
    birthday?: Date
}
interface IProfileUpdateReqData extends IProfileUpdateDBData {
    id: string
}
interface IProfileUpdateResData extends IProfileUpdateReqData {
    email_verified: boolean
}
