"use client"

import { FriendCard } from "@/components/friends/FriendCard"
import { SimpleLayout } from "@/components/layout/SimpleLayout"
import { useLocalizedContent } from "@/components/shared/useLocalizedContent"

export function FriendsPageContent() {
  const { friends } = useLocalizedContent()

  return (
    <SimpleLayout title={friends.headline} intro={friends.intro}>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-8 gap-y-12 pb-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {friends.items.map((friend) => (
          <FriendCard key={friend.name} friend={friend} />
        ))}
      </ul>
    </SimpleLayout>
  )
}
