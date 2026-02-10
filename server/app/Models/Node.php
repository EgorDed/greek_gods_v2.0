<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Node extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'title',
        'type',
        'type_en',
        'short_description',
        'description',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    /* ================= relations ================= */

    public function outgoingEdges(): HasMany
    {
        return $this->hasMany(Edge::class, 'from_node_id');
    }

    public function incomingEdges(): HasMany
    {
        return $this->hasMany(Edge::class, 'to_node_id');
    }

    /* ================= enums ================= */

    public const TYPES = [
        'бог' => 'god',
        'миф' => 'myth',
        'артефакт' => 'artifact',
        'место' => 'place',
        'событие' => 'event',
        'герой' => 'hero',
    ];
}
