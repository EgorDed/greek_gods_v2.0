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
            'chaos' => [
                'title' => 'Хаос',
                'type' => 'персонофикация',
                'type_en' => 'personification',
                'gender' => 'other',
                'icon' => 'default.svg',
                'x' => 0,
                'y' => 0,
                'short_description' => 'Первооснова мира, бездна и разрыв.',
                'description' => 'Хаос — первичная бездна, из которой возникают первые боги и стихии.',
            ],
            'nyx' => [
                'title' => 'Нюкта',
                'type' => 'персонофикация',
                'type_en' => 'personification',
                'gender' => 'female',
                'icon' => 'default.svg',
                'x' => -300,
                'y' => -200,
                'short_description' => 'Богиня ночи, дочь Хаоса.',
                'description' => 'Нюкта (Никта) — персонификация ночи, рождает многих духов и богов.',
            ],
            'erebus' => [
                'title' => 'Эреб',
                'type' => 'персонофикация',
                'type_en' => 'personification',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => -500,
                'y' => 0,
                'short_description' => 'Мрак и тьма подземного мира.',
                'description' => 'Эреб — персонификация мрака и тьмы, первородный бог.',
            ],
            'tartarus' => [
                'title' => 'Тартар',
                'type' => 'место',
                'type_en' => 'place',
                'gender' => 'other',
                'icon' => 'default.svg',
                'x' => 0,
                'y' => 400,
                'short_description' => 'Глубочайшая пропасть подземного мира.',
                'description' => 'Тартар — бездна подземного мира, место заточения титанов и чудовищ.',
            ],
            'gaia' => [
                'title' => 'Гея',
                'type' => 'персонофикация',
                'type_en' => 'personification',
                'gender' => 'female',
                'icon' => 'default.svg',
                'x' => 300,
                'y' => 0,
                'short_description' => 'Персонификация Земли, мать богов и титанов.',
                'description' => 'Гея — великая богиня-земля, мать Урана, гор, моря и множества богов и чудовищ.',
            ],
            'uranus' => [
                'title' => 'Уран',
                'type' => 'персонофикация',
                'type_en' => 'personification',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => 500,
                'y' => -200,
                'short_description' => 'Персонификация неба, супруг Геи.',
                'description' => 'Уран — бог неба, первый властитель мира, супруг и сын Геи.',
            ],
            'hemera' => [
                'title' => 'Гемера',
                'type' => 'персонофикация',
                'type_en' => 'personification',
                'gender' => 'female',
                'icon' => 'default.svg',
                'x' => -300,
                'y' => -20,
                'short_description' => 'Богиня дня.',
                'description' => 'Гемера — персонификация дня, дочь Нюкты и Эреба.',
            ],
            'aether' => [
                'title' => 'Эфир',
                'type' => 'персонофикация',
                'type_en' => 'personification',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => -100,
                'y' => -300,
                'short_description' => 'Чистый верхний воздух богов.',
                'description' => 'Эфир — персонификация верхнего света и воздуха, сын Нюкты и Эреба.',
            ],
            'eros' => [
                'title' => 'Эрос',
                'type' => 'персонофикация',
                'type_en' => 'personification',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => 0,
                'y' => -300,
                'short_description' => 'Первородный бог любви и притяжения.',
                'description' => 'В ранней традиции Эрос — один из первых богов, сила притяжения, объединяющая мир.',
            ],
            // Титаны (основное поколение)
            'cronus' => [
                'title' => 'Кронос',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => 800,
                'y' => -50,
                'short_description' => 'Младший титан, свергнувший Урана.',
                'description' => 'Кронос — титан, сын Геи и Урана, отец Зевса и многих олимпийцев.',
            ],
            'rhea' => [
                'title' => 'Рея',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'female',
                'icon' => 'default.svg',
                'x' => 800,
                'y' => 150,
                'short_description' => 'Титанида, супруга Кроноса.',
                'description' => 'Рея — титанида, мать первого поколения олимпийских богов.',
            ],
            'oceanus' => [
                'title' => 'Океан',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => 650,
                'y' => 250,
                'short_description' => 'Титан океанических вод.',
                'description' => 'Океан — титан, олицетворяющий мировой океан.',
            ],
            'tethys' => [
                'title' => 'Тефида',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'female',
                'icon' => 'default.svg',
                'x' => 950,
                'y' => 250,
                'short_description' => 'Титанида морских вод, супруга Океана.',
                'description' => 'Тефида — титанида, олицетворяющая плодородные воды.',
            ],
            'hyperion' => [
                'title' => 'Гиперион',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => 650,
                'y' => -250,
                'short_description' => 'Титан света.',
                'description' => 'Гиперион — титан, связанный со светом и небесными светилами.',
            ],
            'theia' => [
                'title' => 'Тейя',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'female',
                'icon' => 'default.svg',
                'x' => 950,
                'y' => -250,
                'short_description' => 'Титанида сияния.',
                'description' => 'Тейя — титанида сияния и сокровищ земли.',
            ],
            'iapetus' => [
                'title' => 'Япет',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => 1100,
                'y' => 0,
                'short_description' => 'Титан, отец Прометея.',
                'description' => 'Япет — титан, связанный с человеческим родом, отец Прометея.',
            ],
            'themis' => [
                'title' => 'Фемида',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'female',
                'icon' => 'default.svg',
                'x' => 650,
                'y' => 450,
                'short_description' => 'Титанида божественного закона.',
                'description' => 'Фемида — титанида справедливости и порядка.',
            ],
            'mnemosyne' => [
                'title' => 'Мнемосина',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'female',
                'icon' => 'default.svg',
                'x' => 950,
                'y' => 450,
                'short_description' => 'Титанида памяти.',
                'description' => 'Мнемосина — титанида памяти, мать муз.',
            ],
            'criuse' => [
                'title' => 'Крий',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => 1200,
                'y' => -150,
                'short_description' => 'Один из титанов, сын Геи и Урана.',
                'description' => 'Крий — менее известный титан, связанный с созвездиями.',
            ],
            'coeus' => [
                'title' => 'Кой',
                'type' => 'титан',
                'type_en' => 'titan',
                'gender' => 'male',
                'icon' => 'default.svg',
                'x' => 1200,
                'y' => 150,
                'short_description' => 'Титан разума и оси мира.',
                'description' => 'Кой — титан, связанный с разумом и небесной осью.',
            ],
            // Сторукие и прочие дети Геи и Урана
            'hecatoncheires' => [
                'title' => 'Сторукие',
                'type' => 'гигант',
                'type_en' => 'giant',
                'gender' => 'other',
                'icon' => 'default.svg',
                'x' => 300,
                'y' => 350,
                'short_description' => 'Три сторуких великана, дети Геи и Урана.',
                'description' => 'Сторукие — Бриарей, Котт и Гиес, чудовищные великаны со ста руками.',
            ],
            'cyclopes' => [
                'title' => 'Циклопы',
                'type' => 'гигант',
                'type_en' => 'giant',
                'icon' => 'default.svg',
                'x' => 300,
                'y' => 550,
                'short_description' => 'Одноглазые великаны, дети Геи и Урана.',
                'description' => 'Циклопы — кузнецы богов, одноглазые сыновья Геи и Урана.',
                'gender' => 'other',
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
            // Происхождение первичных богов
            ['chaos', 'nyx', 'родитель', 'parent'],
            ['chaos', 'erebus', 'родитель', 'parent'],
            ['chaos', 'tartarus', 'родитель', 'parent'],
            ['chaos', 'gaia', 'родитель', 'parent'],
            ['chaos', 'eros', 'родитель', 'parent'],

            // Дети Нюкты и Эреба
            ['nyx', 'hemera', 'родитель', 'parent'],
            ['erebus', 'hemera', 'родитель', 'parent'],
            ['nyx', 'aether', 'родитель', 'parent'],
            ['erebus', 'aether', 'родитель', 'parent'],

            // Уран рождается от Геи
            ['gaia', 'uranus', 'родитель', 'parent'],

            // Союз Геи и Урана — рождение титанов
            ['gaia', 'cronus', 'родитель', 'parent'],
            ['uranus', 'cronus', 'родитель', 'parent'],
            ['gaia', 'rhea', 'родитель', 'parent'],
            ['uranus', 'rhea', 'родитель', 'parent'],
            ['gaia', 'oceanus', 'родитель', 'parent'],
            ['uranus', 'oceanus', 'родитель', 'parent'],
            ['gaia', 'tethys', 'родитель', 'parent'],
            ['uranus', 'tethys', 'родитель', 'parent'],
            ['gaia', 'hyperion', 'родитель', 'parent'],
            ['uranus', 'hyperion', 'родитель', 'parent'],
            ['gaia', 'theia', 'родитель', 'parent'],
            ['uranus', 'theia', 'родитель', 'parent'],
            ['gaia', 'iapetus', 'родитель', 'parent'],
            ['uranus', 'iapetus', 'родитель', 'parent'],
            ['gaia', 'themis', 'родитель', 'parent'],
            ['uranus', 'themis', 'родитель', 'parent'],
            ['gaia', 'mnemosyne', 'родитель', 'parent'],
            ['uranus', 'mnemosyne', 'родитель', 'parent'],
            ['gaia', 'criuse', 'родитель', 'parent'],
            ['uranus', 'criuse', 'родитель', 'parent'],
            ['gaia', 'coeus', 'родитель', 'parent'],
            ['uranus', 'coeus', 'родитель', 'parent'],

            // Сторукие и Циклопы — тоже дети Геи и Урана
            ['gaia', 'hecatoncheires', 'родитель', 'parent'],
            ['uranus', 'hecatoncheires', 'родитель', 'parent'],
            ['gaia', 'cyclopes', 'родитель', 'parent'],
            ['uranus', 'cyclopes', 'родитель', 'parent'],

            // Супружеские связи
            ['nyx', 'erebus', 'супруг', 'spouse'],
            ['gaia', 'uranus', 'супруг', 'spouse'],
            ['cronus', 'rhea', 'супруг', 'spouse'],
            ['oceanus', 'tethys', 'супруг', 'spouse'],
            ['hyperion', 'theia', 'супруг', 'spouse'],
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
                'gender' => $data['gender'] ?? null,
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
