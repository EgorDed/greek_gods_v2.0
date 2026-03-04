<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Edge;
use App\Models\Node;
use Illuminate\Http\JsonResponse;

class MetaController extends Controller
{
    public function options(): JsonResponse
    {
        $nodeTypes = collect(Node::TYPES)
            ->map(static function (string $value, string $label): array {
                return [
                    'label' => $label,
                    'value' => $value,
                ];
            })
            ->values()
            ->all();

        $edgeTypes = collect(Edge::TYPES)
            ->map(static function (string $value, string $label): array {
                return [
                    'label' => $label,
                    'value' => $value,
                ];
            })
            ->values()
            ->all();

        $genders = [
            ['label' => 'не задан', 'value' => ''],
            ['label' => 'мужской', 'value' => 'male'],
            ['label' => 'женский', 'value' => 'female'],
            ['label' => 'другое', 'value' => 'other'],
        ];

        return response()->json([
            'node_types' => $nodeTypes,
            'edge_types' => $edgeTypes,
            'genders' => $genders,
        ]);
    }
}

