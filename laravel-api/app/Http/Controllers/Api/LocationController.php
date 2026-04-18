<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\State;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Display a listing of active locations (States and Cities).
     */
    public function index(): JsonResponse
    {
        try {
            $locations = State::where('status', 'Active')
                ->with(['cities' => function ($query) {
                    $query->where('status', 'Active');
                }])
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $locations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch locations',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
