//* dissocier le compte
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";

const ALLOWED_PROVIDERS = ["google", "42-school"];

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions);
	const userId = (session?.user as { id?: string } | undefined)?.id;

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { provider } = (await request.json()) as { provider?: string };

	if (!provider || !ALLOWED_PROVIDERS.includes(provider)) {
		return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
	}

	//supp account selon userId et provider
	await prisma.account.deleteMany({
		where: {
			userId,
			provider,
		},
	});

	return NextResponse.json({ ok: true });
}
