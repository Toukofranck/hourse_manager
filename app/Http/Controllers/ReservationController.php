<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /**
     * Get all reservations for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->input('status');

        $query = Reservation::where('user_id', auth()->id())
            ->with(['property:id,title,image_url,city', 'user:id,name,email']);

        if ($status) {
            $query->byStatus($status);
        }

        $reservations = $query->orderBy('created_at', 'desc')->paginate(12);

        return response()->json($reservations);
    }

    /**
     * Get reservations for a specific property (for property owner)
     */
    public function propertyReservations($propertyId): JsonResponse
    {
        $property = Property::find($propertyId);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        if ($property->user_id !== auth()->id() && !auth()->user()->is_admin ?? false) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $reservations = Reservation::where('property_id', $propertyId)
            ->with(['user:id,name,email', 'property:id,title'])
            ->orderBy('check_in_date', 'asc')
            ->paginate(12);

        return response()->json($reservations);
    }

    /**
     * Get a single reservation
     */
    public function show($id): JsonResponse
    {
        $reservation = Reservation::with([
            'property:id,title,description,image_url,city,address',
            'user:id,name,email',
            'review'
        ])->find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        if ($reservation->user_id !== auth()->id() && !auth()->user()->is_admin ?? false) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($reservation);
    }

    /**
     * Create a new reservation
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'check_in_date' => 'required|date|after:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'number_of_guests' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $property = Property::find($validated['property_id']);

        // Check if property exists and is active
        if (!$property || !$property->is_active) {
            return response()->json(['message' => 'Property not available'], 404);
        }

        // Check if guests exceeds property's guest limit
        if ($validated['number_of_guests'] > $property->guests) {
            return response()->json([
                'message' => 'Number of guests exceeds property limit',
                'max_guests' => $property->guests
            ], 422);
        }

        // Check availability
        if (!Reservation::isDateRangeAvailable(
            $validated['property_id'],
            $validated['check_in_date'],
            $validated['check_out_date']
        )) {
            return response()->json(['message' => 'Dates not available'], 422);
        }

        try {
            DB::beginTransaction();

            // Calculate number of nights and total price
            $checkIn = new \DateTime($validated['check_in_date']);
            $checkOut = new \DateTime($validated['check_out_date']);
            $numberOfNights = $checkIn->diff($checkOut)->days;

            $totalPrice = $numberOfNights * $property->price_per_night;

            $reservation = Reservation::create([
                'user_id' => auth()->id(),
                'property_id' => $validated['property_id'],
                'check_in_date' => $validated['check_in_date'],
                'check_out_date' => $validated['check_out_date'],
                'number_of_guests' => $validated['number_of_guests'],
                'price_per_night' => $property->price_per_night,
                'number_of_nights' => $numberOfNights,
                'total_price' => $totalPrice,
                'status' => 'confirmed',
                'notes' => $validated['notes'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Reservation created successfully',
                'reservation' => $reservation->load(['property:id,title,image_url', 'user:id,name,email'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create reservation', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update reservation status
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'cancellation_reason' => 'nullable|string|required_if:status,cancelled',
        ]);

        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        if ($reservation->user_id !== auth()->id() && !auth()->user()->is_admin ?? false) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $reservation->update([
            'status' => $validated['status'],
            'cancellation_reason' => $validated['cancellation_reason'] ?? null,
        ]);

        return response()->json([
            'message' => 'Reservation status updated successfully',
            'reservation' => $reservation
        ]);
    }

    /**
     * Cancel a reservation
     */
    public function cancel(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'nullable|string',
        ]);

        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        if ($reservation->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($reservation->status === 'cancelled') {
            return response()->json(['message' => 'Reservation is already cancelled'], 422);
        }

        if ($reservation->check_in_date <= now()) {
            return response()->json(['message' => 'Cannot cancel a reservation that has already started'], 422);
        }

        $reservation->update([
            'status' => 'cancelled',
            'cancellation_reason' => $validated['reason'] ?? null,
        ]);

        return response()->json([
            'message' => 'Reservation cancelled successfully',
            'reservation' => $reservation
        ]);
    }
}
