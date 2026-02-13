<?php

namespace App\Services;

use App\Models\Edge;
use Illuminate\Database\Eloquent\Collection;

class EdgeService
{
    /**
     * Дети узла (parent -> child)
     */
    public function childrenOf(int|array $parentIds): Collection
    {
        return Edge::query()
            ->where('type_en', 'parent')
            ->whereIn('from_node_id', (array) $parentIds)
            ->with('toNode')
            ->get();
    }

    /**
     * Родители узла (parent -> child)
     */
    public function parentsOf(int|array $childIds): Collection
    {
        return Edge::query()
            ->where('type_en', 'parent')
            ->whereIn('to_node_id', (array) $childIds)
            ->with('fromNode')
            ->get();
    }

    /**
     * Союзники (ally)
     */
    public function alliesOf(int|array $nodeIds): Collection
    {
        return Edge::query()
            ->where('type_en', 'ally')
            ->whereIn('from_node_id', (array) $nodeIds)
            ->with('toNode')
            ->get();
    }

    /**
     * Враги (enemy)
     */
    public function enemiesOf(int|array $nodeIds): Collection
    {
        return Edge::query()
            ->where('type_en', 'enemy')
            ->whereIn('from_node_id', (array) $nodeIds)
            ->with('toNode')
            ->get();
    }

    /**
     * Все связи узла (в обе стороны)
     */
    public function allRelationsOf(int|array $nodeIds): Collection
    {
        return Edge::query()
            ->where(function ($q) use ($nodeIds) {
                $q->whereIn('from_node_id', (array) $nodeIds)
                    ->orWhereIn('to_node_id', (array) $nodeIds);
            })
            ->with(['fromNode', 'toNode'])
            ->get();
    }
}
