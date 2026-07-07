import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

//* noter sur cookie pour dire qu'on veut lier avec provider

//provider autorise
const ALLOWED_PROVIDERS = ["google", "42-school"];

export async function POST(request: NextRequest) {

	//------------------------- verifier si connecte -------------------------
	// verifie cote serveur si l'utilisateur est connecte, puis retourne sa session
	const session = await getServerSession(authOptions);
	const userId = (session?.user as { id?: string } | undefined)?.id;

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	//------------------------- verifier le type de provider -------------------------
	//lire par frontend --> google/42
	//{ provider } --> prendre body.provider
	const { provider } = (await request.json()) as { provider?: string };

	//------------------------- Response -------------------------
	// ----- 1. erreur -----
	if (!provider || !ALLOWED_PROVIDERS.includes(provider)) {
		return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
	}

	// ----- 2. ok -----
	const response = NextResponse.json({ ok: true });

	//faire cookies
	//key   = oauth_link_provider
	//value = google
	response.cookies.set("oauth_link_provider", provider, {
		httpOnly: true, 	//emppche js du navigateur de lire ce cookie, seul le serveur peut y accéder.
		sameSite: "lax", 	//envoie le cookie lors des navigations normales, tout en limitant les requêtes venant d'autres sites.
		path: "/", 			//rend le cookie disponible sur tout le site, y compris les routes API de NextAuth.
		maxAge: 5 * 60, 	//garde ce cookie pendant 5 minutes seulement, car il sert juste à la liaison OAuth temporaire
	});

	response.cookies.set("oauth_link_user_id", userId, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 5 * 60,
	});

	return response;
}

export async function DELETE() {
	const response = NextResponse.json({ ok: true });

	response.cookies.set("oauth_link_provider", "", {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 0,
	});

	response.cookies.set("oauth_link_user_id", "", {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 0,
	});

	return response;
}