# Firebase Reviews - Quick Reference

## Files Created

- `src/lib/firebase.ts` - Firebase client initialization
- `src/lib/firebase-reviews-service.ts` - Review operations
- `FIREBASE_SETUP.md` - Complete setup guide
- `.env.example` - Environment template (update this)

---

## 7-Step Connection Process

### Step 1: Create Firebase Project

```
https://console.firebase.google.com
→ Add project → eat-street-restaurant → Create
```

### Step 2: Enable Firestore

```
Build → Firestore Database → Create Database → Asia Pacific → Test Mode
```

### Step 3: Get Firebase Config

```
Project Settings → Your apps → Copy Firebase config
```

### Step 4: Create `.env.local`

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Step 5: Install Firebase

```bash
bun add firebase
```

### Step 6: Create Firestore Collection

```
Firestore → Create collection → reviews → Auto ID
```

### Step 7: Set Security Rules

Copy from FIREBASE_SETUP.md and paste in Firestore → Rules

---

## Common Operations

### Get All Reviews

```typescript
import { reviewsService } from "@/lib/firebase-reviews-service";

const reviews = await reviewsService.getAllReviews();
```

### Add Review

```typescript
await reviewsService.addReview({
  name: "John Doe",
  rating: 5,
  text: "Great restaurant!",
  createdAt: Date.now(),
});
```

### Delete Review

```typescript
await reviewsService.deleteReview(reviewId);
```

### Validate Review

```typescript
const { valid, errors } = reviewsService.validateReview(reviewData);
```

---

## Firestore Collection Structure

```
reviews/
├── auto-id-1
│   ├── name: "John Doe"
│   ├── rating: 5
│   ├── text: "Excellent food!"
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
├── auto-id-2
│   ├── name: "Jane Smith"
│   ├── rating: 4
│   ├── text: "Good service"
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
```

---

## Security Rules

```firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reviews/{document=**} {
      allow read;
      allow create: if request.resource.data.name != null
                    && request.resource.data.rating != null
                    && request.resource.data.text != null;
      allow delete: if false;
    }
  }
}
```

---

## Integration with Current App

The review system works with your existing store-based system. To migrate to Firebase:

1. Install Firebase: `bun add firebase`
2. Create `.env.local` with Firebase config
3. Create `reviews` collection in Firestore
4. Update your review submission to use `reviewsService.addReview()`

---

## Troubleshooting

| Problem                            | Solution                                 |
| ---------------------------------- | ---------------------------------------- |
| "Cannot find module 'firebase'"    | Run `bun add firebase`                   |
| "Firebase configuration not found" | Check `.env.local` has all values        |
| "Permission denied"                | Check Firestore security rules           |
| Reviews not appearing              | Check Firestore collection has `reviews` |

---

## Next Steps

1. Follow FIREBASE_SETUP.md steps 1-7
2. Test by adding a review
3. Check Firestore console to see the review
4. Integrate with your review form

---

## Resources

- [Firebase Console](https://console.firebase.google.com)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [JavaScript SDK](https://firebase.google.com/docs/reference/js)
