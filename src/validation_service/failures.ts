/**Used for credential validation failures.*/
export enum ValidationFailureTypes {
    EMPTY_FIELD = "empty field failure",
    CREDENTIAL_TYPE ="credential type failure",
    EMAIL_FORMAT = "email format failure",
    PASS_REQUIREMENT = "password requirement failure",
    EMAIL_EXIST = "email already exist"
}