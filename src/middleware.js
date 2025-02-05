import { auth } from "@/auth"
 
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname == "/dashboard") {
    const newUrl = new URL("/join", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
  if (!!req.auth && req.nextUrl.pathname == "/join") {
    const newUrl = new URL("/dashboard", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  }