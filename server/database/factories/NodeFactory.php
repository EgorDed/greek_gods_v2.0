<?php

namespace Database\Factories;

use App\Models\Node;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class NodeFactory extends Factory
{
    protected $model = Node::class;

    public function definition(): array
    {
        return [
            'code' => $this->faker->word(),
            'title' => $this->faker->word(),
            'description' => $this->faker->text(),
            'short_description' => $this->faker->text(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
