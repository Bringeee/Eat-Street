# Firebase Reviews Database - Complete Setup

## 📦 Files Created (4 files)

### Core Firebase Files (2 files)

```
✅ src/lib/firebase.ts
   └─ Firebase client initialization & types

✅ src/lib/firebase-reviews-service.ts
   └─ All review operations (add, get, delete, validate)
```

### Documentation (2 files)

```
✅ FIREBASE_SETUP.md
   └─ Complete step-by-step setup guide (50+ lines)

✅ FIREBASE_QUICK_REF.md
   └─ Quick reference for common operations
```

### Configuration (1 file)

```
✅ .env.firebase.example
   └─ Environment variables template
```

---

## 🚀 The 10-Step Firebase Connection Process

### Step 1: Create Firebase Project

Go to https://console.firebase.google.com

- Click "Add project"
- Name: `eat-street-restaurant`
- Select region: Asia Pacific
- Click "Create project"
- Wait 1-2 minutes

### Step 2: Enable Firestore Database

- Click on your project
- Go to **Build** → **Firestore Database**
- Click **Create Database**
- Region: **Asia Pacific**
- Start in: **Test Mode**
- Click **Create**

### Step 3: Get Firebase Configuration

- Click **Project Settings** (gear icon)
- Go to **General** tab
- Scroll to **Your apps**
- Click web icon `</>`
- App name: `Eat Street Web`
- Click **Register app**
- Copy the entire `firebaseConfig` object

### Step 4: Create `.env.local` File

In your project root, create `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=eat-street-restaurant.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eat-street-restaurant
VITE_FIREBASE_STORAGE_BUCKET=eat-street-restaurant.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```

Replace with your actual values from Step 3.

### Step 5: Add `.env.local` to `.gitignore`

```bash
echo ".env.local" >> .gitignore
```

### Step 6: Install Firebase Packages

```bash
bun add firebase
```

Or if using npm:

```bash
npm install firebase
```

### Step 7: Create `reviews` Collection in Firestore

- Go to **Firestore Database** in Firebase Console
- Click **+ Create collection**
- Collection ID: `reviews`
- Click **Next**
- Click **Auto ID** (to create first document)
- Click **Save**

### Step 8: Set Up Security Rules

- Go to **Firestore Database** → **Rules** tab
- Replace everything with:

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

- Click **Publish**

### Step 9: Restart Dev Server

```bash
bun run dev
```

### Step 10: Test the Connection

1. Go to your website reviews section
2. Add a test review with name, rating, and text
3. Check Firebase Console → Firestore → `reviews` collection
4. You should see your review appear in real-time! ✅

---

## 💻 How to Use in Your App

### Get All Reviews

```typescript
import { reviewsService } from "@/lib/firebase-reviews-service";

const reviews = await reviewsService.getAllReviews();
console.log(reviews); // Array of reviews from Firebase
```

### Add a Review

```typescript
import { reviewsService } from "@/lib/firebase-reviews-service";

const newReview = await reviewsService.addReview({
  name: "John Doe",
  rating: 5,
  text: "Amazing food and great service!",
  createdAt: Date.now(),
});
```

### Delete a Review

```typescript
import { reviewsService } from "@/lib/firebase-reviews-service";

const success = await reviewsService.deleteReview(reviewId);
if (success) {
  console.log("Review deleted");
}
```

### Validate Before Submitting

```typescript
import { reviewsService } from "@/lib/firebase-reviews-service";

const { valid, errors } = reviewsService.validateReview({
  name: "John",
  rating: 4,
  text: "Great place!",
});

if (!valid) {
  console.log("Validation errors:", errors);
} else {
  // Submit the review
}
```

---

## 📊 Firestore Collection Structure

```
Database: Firestore
└── Collection: reviews
    ├── Document (auto-generated ID)
    │   ├── name (String) - Reviewer name (max 60 chars)
    │   ├── rating (Number) - 1-5 stars
    │   ├── text (String) - Review content (max 500 chars)
    │   ├── createdAt (Timestamp) - When created
    │   └── updatedAt (Timestamp) - When updated
    │
    ├── Document (another review)
    │   ├── name (String)
    │   ├── rating (Number)
    │   ├── text (String)
    │   ├── createdAt (Timestamp)
    │   └── updatedAt (Timestamp)
```

---

## 🔐 Security Features

✅ **Anyone can READ reviews** - Public access
✅ **Anyone can CREATE reviews** - With validation
✅ **Only admin can DELETE** - Prevent spam deletion
✅ **Data validation** - Name, rating, text required
✅ **Environment variables** - Credentials not in code
✅ **Error handling** - All operations wrapped in try-catch
✅ **Toast notifications** - User feedback

---

## 📝 Review Data Validation

The service validates:

- ✅ Name: Required, max 60 characters
- ✅ Rating: Must be 1-5 stars
- ✅ Text: Required, max 500 characters
- ✅ All fields: Must be non-empty

---

## 🆘 Troubleshooting

### Problem: "Cannot find module 'firebase'"

**Solution**: Run `bun add firebase` or `npm install firebase`

### Problem: "Firebase configuration not found"

**Solution**:

1. Check `.env.local` exists in project root
2. Verify all Firebase config values are present
3. Restart dev server: `bun run dev`

### Problem: "Permission denied" error

**Solution**:

1. Go to Firestore → Rules tab
2. Paste the security rules from Step 8
3. Click Publish

### Problem: Reviews not appearing in Firestore

**Solution**:

1. Check browser console (F12) for errors
2. Verify `reviews` collection exists in Firestore
3. Check security rules allow `create` action
4. Make sure all fields (name, rating, text) are filled

### Problem: Blank page when trying to add review

**Solution**:

1. Check browser console for errors
2. Verify Firebase config in `.env.local`
3. Check Firestore security rules
4. Restart dev server

---

## 📚 Documentation Files

| File                    | Purpose              | Read When           |
| ----------------------- | -------------------- | ------------------- |
| `FIREBASE_SETUP.md`     | Complete setup guide | Need detailed steps |
| `FIREBASE_QUICK_REF.md` | Quick reference      | Need quick lookup   |
| `.env.firebase.example` | Environment template | Setting up config   |

---

## 🎯 Integration Steps

1. **Create Firebase Project** ✅ Step 1
2. **Enable Firestore** ✅ Step 2
3. **Get Firebase Config** ✅ Step 3
4. **Create `.env.local`** ✅ Step 4
5. **Install Firebase** ✅ Step 6
6. **Create Collection** ✅ Step 7
7. **Set Security Rules** ✅ Step 8
8. **Test Connection** ✅ Step 10

---

## 🔄 Real-Time Sync (Advanced)

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
  console.log("Live reviews:", reviews);
});

// To stop listening:
// unsubscribe();
```

---

## 🚀 What You Can Now Do

✅ Add reviews to Firebase
✅ Read reviews from Firebase
✅ Validate review data
✅ Delete reviews (admin only)
✅ Real-time sync with multiple users
✅ Automatic timestamps
✅ Error handling with toasts

---

## 📞 Quick Links

- [Firebase Console](https://console.firebase.google.com)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [JavaScript SDK Reference](https://firebase.google.com/docs/reference/js)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)

---

## ✨ Next Steps

1. Follow the 10-step process above
2. Test by adding a review
3. Check Firestore console to see it saved
4. Integrate with your review form
5. Consider adding real-time listeners

---

**Status**: Ready to connect! 🚀
**Files Created**: 5 files
**Total Setup Time**: ~15 minutes
**Complexity**: Beginner-friendly
