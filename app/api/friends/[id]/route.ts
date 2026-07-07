import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/server/prisma'
import { authOptions } from '@/lib/auth'
import { notifyWs } from '@/lib/notifyWs'

function parseFriendshipId(id: string) {
	const friendshipId = Number(id)

	return Number.isInteger(friendshipId) ? friendshipId : null
}

async function findFriendshipForUser(routeId: string, userId: string) {
	const friendshipId = parseFriendshipId(routeId)

	if (friendshipId !== null) {
		return prisma.friendship.findUnique({
			where: { id: friendshipId },
			include: {
				sender: { select: { id: true, username: true } },
				receiver: { select: { id: true, username: true } },
			},
		})
	}

	return prisma.friendship.findFirst({
		where: {
			status: 'ACCEPTED',
			OR: [
				{ senderId: userId, receiverId: routeId },
				{ senderId: routeId, receiverId: userId },
			],
		},
		include: {
			sender: { select: { id: true, username: true } },
			receiver: { select: { id: true, username: true } },
		},
	})
}

// PUT /api/friends/[id] - Accept or reject a friend request
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		//? -----
		// const userId = session.user?.id;
		const userId = (session.user as { id?: string } | undefined)?.id;
		if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		//? -----

		const { id } = await params
		const friendshipId = parseFriendshipId(id)
		if (friendshipId === null) {
			return NextResponse.json({ error: 'Invalid friendship id' }, { status: 400 })
		}

		const body = await request.json()
		const { status } = body

		if (!status || !['ACCEPTED', 'BLOCKED'].includes(status)) {
			return NextResponse.json(
				{ error: 'Status must be ACCEPTED or BLOCKED' },
				{ status: 400 }
			)
		}

		const friendship = await prisma.friendship.findUnique({
			where: { id: friendshipId }
		})

		if (!friendship) {
			return NextResponse.json({ error: 'Friendship not found' }, { status: 404 })
		}

		//? -----
		// if (friendship?.receiverId !== session.user.id) {
		if (friendship.receiverId !== userId) {
		//?
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

	//? -----
		const updatedFriendship = await prisma.$transaction(async (transaction) => {
			const nextFriendship = await transaction.friendship.update({
				where: { id: friendshipId },
				data: { status: status },
				include: {
					sender: { select: { id: true, username: true } },
					receiver: { select: { id: true, username: true } },
				},
			})

			if (status === 'ACCEPTED') {
				await transaction.systemMessage.createMany({
					data: [
						{
							userId: nextFriendship.senderId,
							title: 'Friend request accepted',
							body: `${nextFriendship.receiver.username} accepted your friend request.`,
							isRead: false,
							kind: 'friend-request',
							fromUserId: nextFriendship.receiverId,
							actionStatus: 'accepted',
							i18nKey: 'friendRequest.accepted.sender',
							i18nParams: { username: nextFriendship.receiver.username },
						},
						{
							userId: nextFriendship.receiverId,
							title: 'Friend added',
							body: `${nextFriendship.sender.username} was added to your friend list.`,
							isRead: false,
							kind: 'friend-request',
							fromUserId: nextFriendship.senderId,
							actionStatus: 'accepted',
							i18nKey: 'friendRequest.accepted.receiver',
							i18nParams: { username: nextFriendship.sender.username },
						},
					],
				})
			}

			return nextFriendship
		})
	//? -----

		if (status === 'ACCEPTED') {
			await Promise.all([
				notifyWs('friend.request.accepted', {
					toUserId: updatedFriendship.senderId,
					data: {
						friendshipId: updatedFriendship.id,
						fromUserId: updatedFriendship.receiverId,
					},
				}),
				notifyWs('friend.request.accepted', {
					toUserId: updatedFriendship.receiverId,
					data: {
						friendshipId: updatedFriendship.id,
						fromUserId: updatedFriendship.senderId,
					},
				}),
			])
		}

		return NextResponse.json(updatedFriendship)

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// PATCH /api/friends/[id] - Update my private remark for a friend.
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const userId = (session.user as { id?: string } | undefined)?.id
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = await params
		const body = await request.json()
		const remark = typeof body.displayName === 'string' ? body.displayName.trim() : ''

		if (!remark) {
			return NextResponse.json({ error: 'displayName is required' }, { status: 400 })
		}

		const friendship = await findFriendshipForUser(id, userId)

		if (!friendship || friendship.status !== 'ACCEPTED') {
			return NextResponse.json({ error: 'Friendship not found' }, { status: 404 })
		}

		if (friendship.senderId !== userId && friendship.receiverId !== userId) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const updatedFriendship = await prisma.friendship.update({
			where: { id: friendship.id },
			data:
				friendship.senderId === userId
					? { senderRemark: remark }
					: { receiverRemark: remark },
		})

		return NextResponse.json({
			id: friendship.senderId === userId ? friendship.receiverId : friendship.senderId,
			friendshipId: updatedFriendship.id,
			displayName: remark,
		})
	} catch {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// DELETE /api/friends/[id] - Remove a friend or cancel a request
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> } // ✅ Fix
) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		
		//? -----
		const userId = (session.user as { id?: string } | undefined)?.id;

		if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		//? -----

		const { id } = await params
		const friendship = await findFriendshipForUser(id, userId)

		if (!friendship) {
			return NextResponse.json({ error: 'Friendship not found' }, { status: 404 })
		}

		//?-----
		if (friendship.senderId !== userId && friendship.receiverId !== userId) {
		// if (friendship?.senderId !== session.user.id && friendship?.receiverId !== session.user.id) {
		//? ----
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const wasAccepted = friendship.status === 'ACCEPTED'
		const otherUser =
			friendship.senderId === userId ? friendship.receiver : friendship.sender
		const otherUserId = otherUser.id

		await prisma.$transaction(async (transaction) => {
			await transaction.friendship.delete({
				where: { id: friendship.id }
			})

			if (!wasAccepted) {
				return
			}

			await transaction.systemMessage.createMany({
				data: [
					{
						userId,
						title: 'Friend removed',
						body: `${otherUser.username} was removed from your friend list.`,
						isRead: false,
						kind: 'info',
						fromUserId: otherUserId,
						i18nKey: 'friend.removed',
						i18nParams: { username: otherUser.username },
					},
					{
						userId: otherUserId,
						title: 'Friend removed',
						body: `${friendship.senderId === userId ? friendship.sender.username : friendship.receiver.username} removed the friendship.`,
						isRead: false,
						kind: 'info',
						fromUserId: userId,
						i18nKey: 'friend.removed',
						i18nParams: {
							username:
								friendship.senderId === userId
									? friendship.sender.username
									: friendship.receiver.username,
						},
					},
				],
			})
		})

		if (wasAccepted) {
			await Promise.all([
				notifyWs('friend.removed', {
					toUserId: userId,
					data: { friendshipId: friendship.id, friendId: otherUserId },
				}),
				notifyWs('friend.removed', {
					toUserId: otherUserId,
					data: { friendshipId: friendship.id, friendId: userId },
				}),
			])
		}

		return NextResponse.json(
			{ message: 'Friendship deleted successfully' },
			{ status: 200 }
		)

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
