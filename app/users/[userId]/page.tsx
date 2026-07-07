import PageShell from "@/components/layout/page-shell";
import ProfileFriends from "@/components/profile/profile-friends";
import ProfileUserNotFound from "@/components/profile/profile-friends-not-found";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";

// Render this page at request time because it reads live Prisma data.
// Static prerendering during Docker build cannot access the database.
// dynamic is a default constent by Next.js can be read by APP Router.
export const dynamic = "force-dynamic";

type UserProfilePageProps = {
	params: {
		userId: string;
	};
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return (
			<main id="main-content">
				<PageShell>
					<ProfileUserNotFound />
				</PageShell>
			</main>
		);
	}

	const user = await prisma.user.findUnique({
		where: { id: params.userId },
		select: {
			id: true,
			username: true,
			image: true,
			bio: true,
			learningLevel: true,
			isOnline: true,
			createdAt: true,
		},
	});

	if (!user) {
		return (
			<main id="main-content">
				<PageShell>
					<ProfileUserNotFound />
				</PageShell>
			</main>
		);
	}

	// Count the number of accepted friendships for the user
	const friendCount = await prisma.friendship.count({
	where: {
		status: "ACCEPTED",
		OR: [
		{ senderId: params.userId },
		{ receiverId: params.userId },
		],
	},
	});

	// Calculate the user's overall accuracy based on their letter progress
	const letterStats = await prisma.userLetterProgress.aggregate({
	where: { userId: params.userId },
	_sum: {
		correctCount: true,
		totalSeen: true,
	},
	});

	const totalSeen = letterStats._sum.totalSeen ?? 0;
	const totalCorrect = letterStats._sum.correctCount ?? 0;
	const accuracy = totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0;

  return (
    <main id="main-content">
      <PageShell>
        <ProfileFriends
          name={user.username}
          username={user.username}
          image={user.image}
          isOnline={user.isOnline}
          bio={user.bio}
          learningLevel={user.learningLevel}
          friendCount={friendCount} 
		  accuracy={accuracy}
          createdAt={user.createdAt}
        />
      </PageShell>
    </main>
  );
}

// ! i18n: move public profile fallback text, online/offline labels, avatar alt text, and temporary description into the i18n dictionary.
// ! i18n: keep friend.displayName and friend.username as dynamic user data.
