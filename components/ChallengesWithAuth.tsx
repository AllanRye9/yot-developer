'use client'
import UserAuth from './UserAuth'
import Challenges from './Challenges'

export default function ChallengesWithAuth() {
  return (
    <UserAuth>
      {(username, displayName) => (
        <Challenges username={username} displayName={displayName} />
      )}
    </UserAuth>
  )
}
