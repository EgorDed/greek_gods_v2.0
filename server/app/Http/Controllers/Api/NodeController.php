<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNodeRequest;
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

        return $query
            ->orderBy('id')
            ->paginate(50);
    }

    public function store(StoreNodeRequest $request)
    {
        $data = $request->validated();
        // Нужно конвертировать в json чтобы дб приняла.
        $data['meta'] = json_encode($data['meta']);

        return Node::create($data);
    }

    public function show(Node $node)
    {
        return $node->load([
            'outgoingEdges.toNode',
            'incomingEdges.fromNode',
        ]);
    }

    public function update(Request $request, Node $node)
    {
        $data = $request->validate([
            'code'              => 'string|unique:nodes,code,' . $node->id,
            'title'             => 'string',
            'type'              => 'string',
            'type_en'           => 'string',
            'short_description' => 'string',
            'description'       => 'string',
            'meta'              => 'nullable|array',
        ]);

        $node->update($data);

        return $node;
    }

    public function destroy(Node $node)
    {
        // TODO: Проверять связанные edge.
        $node->delete();

        return response()->noContent();
    }
}
