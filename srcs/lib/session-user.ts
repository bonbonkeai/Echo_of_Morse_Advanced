//* Retrieve the user ID from the session using NextAuth.js.
//* Safer, cause the front end can't ask by using other's ID.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSessionUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}
