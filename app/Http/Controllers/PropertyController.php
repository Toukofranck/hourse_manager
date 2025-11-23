<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PropertyController extends Controller
{
    /**
     * Get all properties with filtering and sorting
     */
    public function index(Request $request): JsonResponse
    {
        $params = $request->only([
            'city',
            'country',
            'min_price',
            'max_price',
            'property_type',
            'bedrooms',
            'guests',
            'check_in_date',
            'check_out_date',
            'sort_by',
            'search',
        ]);

        $query = Property::search($params);

        // Handle general search (searches in title and description)
        if (isset($params['search'])) {
            $search = $params['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 12);

        $properties = $query->with(['owner:id,name,email', 'amenities', 'reviews'])
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($properties);
    }

    /**
     * Get a single property with all details
     */
    public function show($id): JsonResponse
    {
        $property = Property::with([
            'owner:id,name,email',
            'amenities',
            'reviews.user:id,name',
            'reservations' => function ($query) {
                $query->where('status', '!=', 'cancelled');
            }
        ])->find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        return response()->json($property);
    }

    /**
     * Create a new property
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'address' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'price_per_night' => 'required|numeric|min:0',
            'bedrooms' => 'required|integer|min:1',
            'bathrooms' => 'required|integer|min:1',
            'guests' => 'required|integer|min:1',
            'property_type' => 'required|in:apartment,house,villa,studio,cottage,room',
            'image_url' => 'nullable|url',
            'amenities' => 'nullable|array',
        ]);

        $validated['user_id'] = auth()->id();

        $property = Property::create($validated);

        if ($request->has('amenities')) {
            $property->amenities()->sync($request->input('amenities', []));
        }

        return response()->json([
            'message' => 'Property created successfully',
            'property' => $property->load(['amenities', 'owner:id,name,email'])
        ], 201);
    }

    /**
     * Update a property
     */
    public function update(Request $request, $id): JsonResponse
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        if ($property->user_id !== auth()->id() && !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'city' => 'sometimes|required|string|max:100',
            'country' => 'sometimes|required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'address' => 'sometimes|required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'price_per_night' => 'sometimes|required|numeric|min:0',
            'bedrooms' => 'sometimes|required|integer|min:1',
            'bathrooms' => 'sometimes|required|integer|min:1',
            'guests' => 'sometimes|required|integer|min:1',
            'property_type' => 'sometimes|in:apartment,house,villa,studio,cottage,room',
            'image_url' => 'nullable|url',
            'is_active' => 'sometimes|boolean',
            'amenities' => 'nullable|array',
        ]);

        $property->update($validated);

        if ($request->has('amenities')) {
            $property->amenities()->sync($request->input('amenities', []));
        }

        return response()->json([
            'message' => 'Property updated successfully',
            'property' => $property->load(['amenities', 'owner:id,name,email'])
        ]);
    }

    /**
     * Delete a property
     */
    public function destroy($id): JsonResponse
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        if ($property->user_id !== auth()->id() && !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $property->delete();

        return response()->json(['message' => 'Property deleted successfully']);
    }

    /**
     * Get all amenities
     */
    public function getAmenities(): JsonResponse
    {
        $amenities = Amenity::all();
        return response()->json($amenities);
    }

    /**
     * Get user's properties
     */
    public function myProperties(): JsonResponse
    {
        $properties = Property::where('user_id', auth()->id())
            ->with(['amenities', 'reviews'])
            ->paginate(12);

        return response()->json($properties);
    }
}
