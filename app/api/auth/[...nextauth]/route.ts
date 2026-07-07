import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; //Importer la configuration lib/auth

//creer une fonction au nom handler
const handler = NextAuth(authOptions);
//donne 2 nom pour cette fonction
export { handler as GET, handler as POST };
