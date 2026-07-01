import { pagesContent } from './content'

export const friendsHeadLine = pagesContent.friends.headline
export const friendsIntro = pagesContent.friends.intro

export type FriendItemType = {
  name: string
  description?: string
  link: { href: string, label?: string }
  logo?: string
}

export const friends: Array<FriendItemType> = pagesContent.friends.items
