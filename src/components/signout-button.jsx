// "use client"
// import { signOut } from "next-auth/react"
 
// export function SignOut() {
//   return <button onClick={() => signOut()}>Sign Out</button>
// }


import { signOut } from "@/auth"

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  )
}