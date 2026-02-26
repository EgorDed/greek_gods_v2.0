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
        'avatar',
        'icon',
        'meta',
        'x',
        'y',
    ];

    protected $casts = [
        'meta' => 'array',
        'x' => 'float',
        'y' => 'float',
    ];

    protected $appends = ['position'];

    protected $hidden = ['x', 'y'];

    public function getPositionAttribute(): array
    {
        return [
            'x' => $this->x,
            'y' => $this->y,
        ];
    }

    public function setPositionAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['x'] = $value['x'] ?? 0;
            $this->attributes['y'] = $value['y'] ?? 0;
        }
    }

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
        'демиург' => 'demiurge',
    ];
}
