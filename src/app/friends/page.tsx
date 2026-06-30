import { type Metadata } from 'next'

import { FriendsPageContent } from '@/components/friends/FriendsPageContent'
import { friendsHeadLine } from '@/config/infoConfig'

export const metadata: Metadata = {
  title: 'Friends',
  description: friendsHeadLine,
}

export default function Friends() {
  return <FriendsPageContent />
}
