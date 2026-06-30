import { friendsContent } from './content'

export const friendsHeadLine = friendsContent.headline
export const friendsIntro = friendsContent.intro

export type FriendItemType = {
  name: string
  description?: string
  link: { href: string, label?: string }
  logo?: string
}

export const friends: Array<FriendItemType> = friendsContent.items
