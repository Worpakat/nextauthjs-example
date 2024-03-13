import { Session } from "inspector"
import NextAuth from "next-auth"

//Type extending documentation page: https://next-auth.js.org/getting-started/typescript
declare module "next-auth" {
  interface User {
    email: string
    email_verified: boolean
    role: string // Add the role property
    imageURL?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      email_verified: boolean
      role: string // Add the role property
      imageURL?: string
    }
  }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string
    role: string
    email_verified: boolean
    //using default 'picture' attr. for image URL
  }
}