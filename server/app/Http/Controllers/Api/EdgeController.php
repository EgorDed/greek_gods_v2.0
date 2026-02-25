<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EdgeRequest;
use App\Models\Edge;
use Illuminate\Http\Request;

class EdgeController extends Controller
{
    public function index()
    {
        return Edge::with(['fromNode', 'toNode'])->paginate(50);
    }

    public function store(EdgeRequest $request)
    {
        $data = $request->validated();

        return Edge::create($data);
    }

    public function show(Edge $edge)
    {
        return $edge->load(['fromNode', 'toNode']);
    }

    public function update(EdgeRequest $request, Edge $edge)
    {
        $data = $request->validated();

        $edge->update($data);

        return response()->json($edge);
    }

    public function destroy(Edge $edge)
    {
        $edge->delete();

        return response()->json(['status' => 'ok']);
    }
}
