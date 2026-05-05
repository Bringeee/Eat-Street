import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "sonner";
import type { FirebaseReview, FirebaseReviewDocument } from "./firebase";

/**
 * Reviews Service - Handle all review-related database operations
 */
export const reviewsService = {
  /**
   * Fetch all reviews from Firebase
   */
  async getAllReviews(): Promise<FirebaseReviewDocument[]> {
    try {
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const reviews: FirebaseReviewDocument[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          name: data.name,
          rating: data.rating,
          text: data.text,
          createdAt: data.createdAt.toMillis ? data.createdAt.toMillis() : data.createdAt,
          updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt,
        });
      });

      return reviews;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
      return [];
    }
  },

  /**
   * Add a new review to Firebase
   */
  async addReview(review: Omit<FirebaseReview, "id">): Promise<FirebaseReviewDocument | null> {
    try {
      // Validate review data
      if (!review.name.trim() || !review.text.trim()) {
        toast.error("Name and review text are required");
        return null;
      }

      if (review.rating < 1 || review.rating > 5) {
        toast.error("Rating must be between 1 and 5");
        return null;
      }

      const reviewsRef = collection(db, "reviews");
      const docRef = await addDoc(reviewsRef, {
        name: review.name.trim().slice(0, 60),
        rating: review.rating,
        text: review.text.trim().slice(0, 500),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast.success("Review added successfully!");

      return {
        id: docRef.id,
        name: review.name,
        rating: review.rating,
        text: review.text,
        createdAt: Date.now(),
      };
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review");
      return null;
    }
  },

  /**
   * Delete a review from Firebase
   */
  async deleteReview(id: string): Promise<boolean> {
    try {
      const reviewRef = doc(db, "reviews", id);
      await deleteDoc(reviewRef);
      toast.success("Review deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
      return false;
    }
  },

  /**
   * Validate review before submission
   */
  validateReview(review: Partial<FirebaseReview>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!review.name || review.name.trim().length === 0) {
      errors.push("Name is required");
    }

    if (!review.text || review.text.trim().length === 0) {
      errors.push("Review text is required");
    }

    if (!review.rating || review.rating < 1 || review.rating > 5) {
      errors.push("Rating must be between 1 and 5 stars");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};
