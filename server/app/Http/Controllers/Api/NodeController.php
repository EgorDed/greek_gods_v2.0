<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NodeRequest;
use App\Models\Edge;
use App\Models\Node;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use function PHPUnit\Framework\isType;

class NodeController extends Controller
{
    public function index(Request $request)
    {
        $query = Node::query();

        if ($request->filled('type_en')) {
            $query->where('type_en', $request->string('type_en'));
        }

        if ($request->filled('code')) {
            $query->where('code', $request->string('code'));
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->string('search') . '%');
        }

        return $query
            ->orderBy('id')
            ->paginate(50);
    }

    public function store(NodeRequest $request)
    {
        $data = $request->validated();

        return Node::create($data);
    }

    public function show(Request $request, Node $node)
    {
        $types = $request->query('relations');

        $response = [
            'node' => $node,
        ];

        if (!$types) {
            return response()->json($response);
        }

        if ($types === 'all') {
            $types = array_values(Edge::TYPES);
        } else {
            $types = array_map('trim', explode(',', $types));
        }

        $edges = Edge::query()
            ->where(function ($q) use ($node) {
                $q->where('from_node_id', $node->id)
                    ->orWhere('to_node_id', $node->id);
            })
            ->whereIn('type_en', $types)
            ->with(['fromNode', 'toNode'])
            ->get();

        $groups = [];

        foreach ($edges as $edge) {
            $type = $edge->type_en;

            if ($edge->from_node_id === $node->id) {
                $groups[$type][] = $edge->toNode;
            } else {
                $groups[$type][] = $edge->fromNode;
            }
        }

        $response['relations'] = $groups;

        return response()->json($response);
    }


    public function update(NodeRequest $request, Node $node)
    {
        $data = $request->validated();

        $node->update($data);

        return $node;
    }

    public function destroy(Node $node)
    {
        // TODO: Проверять связанные edge.
        $node->delete();

        return response()->noContent();
    }

    public function graph()
    {
        return response()->json([
            'nodes' => Node::all(),
            'edges' => Edge::all(),
        ]);
    }
}
