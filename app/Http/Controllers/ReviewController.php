<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Reservation;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    /**
     * Get all reviews for a property
     */
    public function propertyReviews($propertyId): JsonResponse
    {
        $reviews = Review::where('property_id', $propertyId)
            ->with(['user:id,name', 'reservation:id'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * Create a new review
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10',
        ]);

        $reservation = Reservation::with('property')->find($validated['reservation_id']);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        if ($reservation->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($reservation->status !== 'completed') {
            return response()->json(['message' => 'Can only review completed reservations'], 422);
        }

        if (Review::where('reservation_id', $validated['reservation_id'])->exists()) {
            return response()->json(['message' => 'Review already exists for this reservation'], 422);
        }

        $review = Review::create([
            'reservation_id' => $validated['reservation_id'],
            'user_id' => auth()->id(),
            'property_id' => $reservation->property_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        // Update property rating
        $property = $reservation->property;
        $allReviews = Review::where('property_id', $property->id)->get();
        $averageRating = $allReviews->avg('rating');
        $reviewsCount = $allReviews->count();

        $property->update([
            'rating' => $averageRating,
            'reviews_count' => $reviewsCount,
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'review' => $review->load(['user:id,name', 'property:id,title'])
        ], 201);
    }

    /**
     * Update a review
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'comment' => 'sometimes|required|string|min:10',
        ]);

        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        if ($review->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->update($validated);

        // Recalculate property rating
        $property = $review->property;
        $allReviews = Review::where('property_id', $property->id)->get();
        $averageRating = $allReviews->avg('rating');

        $property->update(['rating' => $averageRating]);

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy($id): JsonResponse
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        if ($review->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $propertyId = $review->property_id;
        $review->delete();

        // Recalculate property rating
        $property = Property::find($propertyId);
        if ($property) {
            $allReviews = Review::where('property_id', $propertyId)->get();
            $averageRating = $allReviews->count() > 0 ? $allReviews->avg('rating') : 0;
            $reviewsCount = $allReviews->count();

            $property->update([
                'rating' => $averageRating,
                'reviews_count' => $reviewsCount,
            ]);
        }

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
