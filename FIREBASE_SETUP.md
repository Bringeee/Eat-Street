# Firebase Setup Guide for Reviews - Eat Street

This guide will help you connect your Eat Street Restaurant reviews to Firebase Firestore for real-time data storage and retrieval.

## Prerequisites

- A Firebase account (sign up at https://firebase.google.com if you don't have one)
- Your Eat Street project already has the review structure in place
- Node.js and npm/bun installed

## Step-by-Step Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `eat-street-restaurant` (or your preferred name)
4. Select region closest to your users (e.g., Asia Pacific)
5. Click "Create project"
6. Wait for the project to initialize (1-2 minutes)

### Step 2: Enable Firestore Database

1. In Firebase Console, click on your project
2. Go to **Build** → **Firestore Database** (left sidebar)
3. Click **Create Database**
4. Select region: **Asia Pacific** (or your preferred region)
5. Select security rules: **Start in test mode** (for development)
6. Click **Create**

**Important**: You'll see a warning about test mode. We'll configure proper security rules later.

### Step 3: Get Your Firebase Config

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll down to **Your apps**
3. Click on the web icon (`</>`) to create a web app
4. App name: `Eat Street Web`
5. Click **Register app**
6. Copy the Firebase config (you'll see something like):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "eat-street-restaurant.firebaseapp.com",
  projectId: "eat-street-restaurant",
  storageBucket: "eat-street-restaurant.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890",
};
```

### Step 4: Create `.env.local` File

Create or update `.env.local` in your project root:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=eat-street-restaurant.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eat-street-restaurant
VITE_FIREBASE_STORAGE_BUCKET=eat-street-restaurant.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef1234567890
```

Replace with your actual Firebase config values.

### Step 5: Install Firebase Packages

Run this command to install Firebase:

```bash
bun add firebase
```

Or if using npm:

```bash
npm install firebase
```

### Step 6: Create Firestore Collection

1. Go to **Firestore Database** in Firebase Console
2. Click **+ Create collection**
3. Collection ID: `reviews`
4. Click **Next**
5. Click **Auto ID** to create the first document, then close
6. This creates an empty `reviews` collection (we'll add reviews from the app)

### Step 7: Set Up Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with:

```firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read reviews
    match /reviews/{document=**} {
      allow read;
      allow create: if request.resource.data.name != null
                    && request.resource.data.rating != null
                    && request.resource.data.text != null;
      allow delete: if false; // Only admin can delete
    }
  }
}
```

3. Click **Publish**

### Step 8: Add `.env.local` to `.gitignore`

Make sure your `.env.local` is in `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

### Step 9: Install Package

```bash
bun add firebase
```

### Step 10: Test the Connection

1. Start your dev server:

```bash
bun run dev
```

2. Go to the reviews section on your website
3. Add a test review
4. Check Firebase Console → Firestore → `reviews` collection
5. You should see your review appear in real-time!

---

## File Structure

```
src/lib/
├── firebase.ts                    ← Firebase client setup
└── firebase-reviews-service.ts    ← Review operations

.env.local                          ← Your Firebase config (add to .gitignore)
```

---

## Database Collection Structure

### Reviews Collection

```
Collection: reviews
├── Document (auto-generated ID)
│   ├── name (String) - Reviewer name
│   ├── rating (Number) - 1-5 stars
│   ├── text (String) - Review content
│   ├── createdAt (Timestamp) - When review was created
│   └── updatedAt (Timestamp) - When review was last updated
```

---

## How to Use in Your App

### Get All Reviews

```typescript
import { reviewsService } from "@/lib/firebase-reviews-service";

const reviews = await reviewsService.getAllReviews();
console.log(reviews);
```

### Add a Review

```typescript
import { reviewsService } from "@/lib/firebase-reviews-service";

const newReview = await reviewsService.addReview({
  name: "John Doe",
  rating: 5,
  text: "Amazing food and service!",
  createdAt: Date.now(),
});
```

### Delete a Review

```typescript
const success = await reviewsService.deleteReview(reviewId);
```

### Validate Review

```typescript
const { valid, errors } = reviewsService.validateReview({
  name: "John",
  rating: 5,
  text: "Great!",
});

if (!valid) {
  console.log("Errors:", errors);
}
```

---

## Real-Time Sync (Optional)

To get real-time updates when reviews are added:

```typescript
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const reviewsRef = collection(db, "reviews");
const q = query(reviewsRef, orderBy("createdAt", "desc"));

const unsubscribe = onSnapshot(q, (snapshot) => {
  const reviews = [];
  snapshot.forEach((doc) => {
    reviews.push({ id: doc.id, ...doc.data() });
  });
  console.log("Real-time reviews:", reviews);
});

// To stop listening:
// unsubscribe();
```

---

## Troubleshooting

### Connection Issues

**Error**: "Firebase configuration not found"

- Solution: Check that `.env.local` has all required Firebase config values
- Restart dev server after adding env variables

**Error**: "Cannot find module 'firebase'"

- Solution: Run `bun add firebase` or `npm install firebase`

**Error**: "Permission denied" in Firestore

- Solution: Check security rules in Firestore Console
- Make sure `reviews` collection allows reads and creates

**Error**: Reviews not appearing

- Check browser console for errors (F12)
- Verify Firebase config is correct
- Check Firestore security rules

### Reviews Not Saving

1. Check Firebase Console → Firestore → `reviews` collection
2. Verify security rules allow `create` action
3. Check browser console for detailed error message
4. Make sure all required fields are filled (name, rating, text)

---

## Security Best Practices

1. **Never commit `.env.local`** - Keep Firebase keys safe
2. **Use test mode initially** - For development only
3. **Set up proper security rules** - Before production
4. **Validate data** - Always validate on client and server
5. **Rate limiting** - Consider adding rate limiting for spam prevention

---

## Next Steps

1. ✅ Create Firebase project
2. ✅ Enable Firestore database
3. ✅ Create `reviews` collection
4. ✅ Set up security rules
5. ✅ Add Firebase config to `.env.local`
6. ✅ Install Firebase package
7. ✅ Test with a review submission
8. **Optional**: Set up real-time listeners
9. **Optional**: Add admin deletion feature
10. **Optional**: Move to production mode

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [JavaScript SDK Reference](https://firebase.google.com/docs/reference/js)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## Support

For issues or questions:

- Check Firebase Console for errors
- Review Firestore security rules
- Check browser console (F12) for detailed errors
- Verify `.env.local` has all required values
