"use client";
//outil pour utiliser useSession()
import { SessionProvider } from "next-auth/react"; 
import type { ReactNode } from "react";

export default function AuthSessionProvider({ children,}: { children: ReactNode;}) {
	// SocketProvider is mounted once in app/layout.tsx to avoid duplicate connections.
	return (
	<SessionProvider>
			{children}
	</SessionProvider>
	);
}
