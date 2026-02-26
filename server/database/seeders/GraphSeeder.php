<?php

namespace Database\Seeders;

use App\Models\Edge;
use App\Models\Node;
use Illuminate\Database\Seeder;

class GraphSeeder extends Seeder
{
    /**
     * Узлы графа: code => [title, type, type_en, x, y, short_description, description]
     * Координаты x,y — позиция на канвасе React Flow (в пикселях).
     */
    private function nodeData(): array
    {
        return [
            'zeus' => [
                'title' => 'Зевс',
                'type' => 'бог',
                'type_en' => 'god',
                'icon' => 'zeus.svg',
                'x' => 500,
                'y' => 400,
                'short_description' => 'Верховный бог, громовержец.',
                'description' => 'Зевс — царь богов Олимпа, бог неба, грома и молний. Сын Кроноса и Реи.',
            ],
            'hera' => [
                'title' => 'Гера',
                'type' => 'бог',
                'type_en' => 'god',
                'icon' => 'hera.svg',
                'x' => 120,
                'y' => 220,
                'short_description' => 'Царица богов, покровительница брака.',
                'description' => 'Гера — супруга Зевса, богиня брака и семьи.',
            ],
            'athena' => [
                'title' => 'Афина',
                'type' => 'бог',
                'type_en' => 'god',
                'icon' => 'athena.svg',
                'x' => 880,
                'y' => 220,
                'short_description' => 'Богиня мудрости и справедливой войны.',
                'description' => 'Афина — дочь Зевса, богиня мудрости, ремёсел и военной стратегии.',
            ],
            'apollo' => [
                'title' => 'Аполлон',
                'type' => 'бог',
                'type_en' => 'god',
                'icon' => 'apollo.svg',
                'x' => 920,
                'y' => 520,
                'short_description' => 'Бог света, искусств и пророчеств.',
                'description' => 'Аполлон — бог солнца, музыки, поэзии и врачевания.',
            ],
            'poseidon' => [
                'title' => 'Посейдон',
                'type' => 'бог',
                'type_en' => 'god',
                'icon' => 'poseidon.svg',
                'x' => 80,
                'y' => 520,
                'short_description' => 'Бог морей и землетрясений.',
                'description' => 'Посейдон — брат Зевса, владыка морей и океанов.',
            ],
            'hades' => [
                'title' => 'Аид',
                'type' => 'бог',
                'type_en' => 'god',
                'icon' => 'hades.svg',
                'x' => 500,
                'y' => 720,
                'short_description' => 'Бог подземного царства мёртвых.',
                'description' => 'Аид — брат Зевса, владыка царства мёртвых.',
            ],
            'olympus' => [
                'title' => 'Олимп',
                'type' => 'место',
                'type_en' => 'place',
                'icon' => 'place.svg',
                'x' => 500,
                'y' => 920,
                'short_description' => 'Гора, обитель богов.',
                'description' => 'Священная гора в Фессалии, место пребывания олимпийских богов.',
            ],
            'heracles' => [
                'title' => 'Геракл',
                'type' => 'герой',
                'type_en' => 'hero',
                'icon' => 'hero.svg',
                'x' => 920,
                'y' => 720,
                'short_description' => 'Величайший герой, сын Зевса.',
                'description' => 'Геракл — полубог, совершивший двенадцать подвигов.',
            ],
            'test-node-1' => [
                'title' => 'Test Node',
                'type' => 'бог',
                'type_en' => 'god',
                'icon' => 'default.svg',
                'x' => 50,
                'y' => 50,
                'short_description' => 'Test short description',
                'description' => 'Test full description',
            ],
        ];
    }

    /**
     * Связи: одна направленная связь на отношение [from_code, to_code, type, type_en].
     * Без дублирования обратных рёбер (только «родитель», без «ребенок» в обратную сторону).
     */
    private function edgeData(): array
    {
        return [
            ['zeus', 'athena', 'родитель', 'parent'],
            ['zeus', 'hera', 'супруг', 'spouse'],
            ['zeus', 'apollo', 'родитель', 'parent'],
            ['zeus', 'poseidon', 'брат', 'brother'],
            ['zeus', 'hades', 'брат', 'brother'],
            ['zeus', 'heracles', 'родитель', 'parent'],
            ['zeus', 'olympus', 'расположен в', 'located_in'],
        ];
    }

    public function run(): void
    {
        Edge::query()->delete();
        Node::query()->delete();

        $nodesByCode = [];
        foreach ($this->nodeData() as $code => $data) {
            $node = Node::create([
                'code' => $code,
                'title' => $data['title'],
                'type' => $data['type'],
                'type_en' => $data['type_en'],
                'avatar' => $data['avatar'] ?? null,
                'icon' => $data['icon'] ?? null,
                'short_description' => $data['short_description'] ?? null,
                'description' => $data['description'] ?? null,
                'meta' => $data['meta'] ?? ['key' => 'value'],
                'x' => $data['x'],
                'y' => $data['y'],
            ]);
            $nodesByCode[$code] = $node;
        }

        foreach ($this->edgeData() as [$fromCode, $toCode, $type, $typeEn]) {
            $from = $nodesByCode[$fromCode] ?? null;
            $to = $nodesByCode[$toCode] ?? null;
            if ($from && $to) {
                Edge::create([
                    'type' => $type,
                    'type_en' => $typeEn,
                    'from_node_id' => $from->id,
                    'to_node_id' => $to->id,
                    'meta' => [],
                ]);
            }
        }
    }
}
