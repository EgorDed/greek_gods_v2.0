<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Edge extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'type_en',
        'from_node_id',
        'to_node_id',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /* ================= relations ================= */

    public function fromNode(): BelongsTo
    {
        return $this->belongsTo(Node::class, 'from_node_id');
    }

    public function toNode(): BelongsTo
    {
        return $this->belongsTo(Node::class, 'to_node_id');
    }

    /* ================= enums ================= */

    public const TYPES = [
        'родитель' => 'parent',
        'ребенок' => 'child',
        'супруг' => 'spouse',
        'брат' => 'brother',
        'враг' => 'enemy',
        'союзник' => 'ally',
        'владелец' => 'owns',
        'участвует' => 'participates',
        'расположен в' => 'located_in',
    ];
}
