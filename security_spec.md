# Security Specification (KasbNoma)

## 1. Data Invariants
1. `users/{userId}` document belongs strictly to authenticated verified user where `userId == request.auth.uid` and `uid == request.auth.uid`.
2. PII fields (`email`, `displayName`) are never readable by other users (`allow get: if isOwner(userId)`). Listing `/users` collection globally is denied.
3. `users/{userId}/testResults/{resultId}` cannot exist without parent `/users/{userId}` (`exists(...)` Master Gate) and must have `userId == request.auth.uid`, valid bounded integer `score` (`0 <= score <= totalQuestions`), `percent` (`0 <= percent <= 100`), and server timestamp `createdAt == request.time`.
4. `users/{userId}/roadmaps/{roadmapId}` cannot exist without parent `/users/{userId}` and must match `userId == request.auth.uid` with bounded string lengths.
5. `uid`, `userId`, `email`, and `createdAt` are immutable after creation.

## 2. Dirty Dozen Adversarial Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated read on `/users/uid1`: `request.auth == null`.
2. Cross-user read on `/users/uid2` while signed in as `uid1`.
3. Unverified email user creating `/users/uid1`: `request.auth.token.email_verified == false`.
4. Identity spoofing create `/users/uid1` with `uid: "uid2"`.
5. Shadow field injection on `/users/uid1` create with extra field `isAdmin: true`.
6. Oversized string on `/users/uid1` with `displayName` > 120 chars.
7. Client-forged timestamp on `/users/uid1` with `createdAt: Timestamp(2020-01-01)`.
8. Immutable field update on `/users/uid1` attempting to change `email` or `createdAt`.
9. Path variable ID poisoning on `/users/uid1/testResults/<150-char-invalid-id!>`.
10. Orphaned subcollection write `/users/uid1/testResults/r1` when `/users/uid1` does not exist.
11. Score tampering on `/users/uid1/testResults/r1` with `score: 999, totalQuestions: 10`.
12. Cross-user list query on `/users/uid2/testResults` while signed in as `uid1`.
