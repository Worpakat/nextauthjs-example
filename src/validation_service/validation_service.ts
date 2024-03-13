export class CredentialValidationService {

    public static validateCredentialTypes(email: any, password: any) {
        return typeof email === "string" && typeof password === "string"
    }

    /**Checks if string is in email form.*/
    public static validateEmailFormat(email: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**Checks if password meet requirements.*/
    public static validatePasswordRequirements(password: string) {
        // Check length
        if (password.length < 8) {
            return false;
        }

        // Check character types
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[^a-zA-Z0-9\s]/.test(password);

        return hasUppercase && hasLowercase && hasNumber && hasSymbol;
    }

    public static isPasswordsMatches(password: string, confirmPassword: string) {
        return password === confirmPassword;
    }

    /**Used for validation of profile password change inputs and reset password inputs. Returns false if not valid else true.*/
    public static validatePasswordFields(
        newPasword: string,
        confirmPassword: string,
        setErrorMessage: React.Dispatch<React.SetStateAction<string[]>>,
        oldPassword?: string
    ): boolean {
        //Check if fields filled.
        if (newPasword.length === 0 || confirmPassword.length === 0 || (oldPassword && oldPassword.length === 0)) {
            setErrorMessage(["All change password fields must be filled."]);
            return false;
        }

        //Check do passwords match.
        if (!this.isPasswordsMatches(newPasword, confirmPassword)) {
            setErrorMessage(["Passwords doesn't match."]);
            return false;
        }
        //Check password requirements are met.
        if (!this.validatePasswordRequirements(newPasword)) {
            setErrorMessage([
                "Your password doesn't meet the requirements yet:",
                " -It must be at least 8 characters long.",
                " -It needs to include a mix of uppercase letters (A-Z), lowercase letters (a-z) numbers (0-9), and symbols (!@#$%^&*).",
                " -It needs to include at least one number(0-9) and one symbol(!@#$%^&* etc.)",
            ]);
            return false;
        }

        return true;
    }
}