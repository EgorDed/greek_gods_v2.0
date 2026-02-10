<?php

namespace App\Http\Requests;

use App\Models\Edge;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EdgeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'from_node_id' => [
                'required',
                'integer',
                'exists:nodes,id',
            ],
            'to_node_id' => [
                'required',
                'integer',
                'exists:nodes,id',
            ],
            'type' => [
                'required',
                'string',
                Rule::in(array_keys(Edge::TYPES)),
            ],
            'type_en' => [
                'required',
                'string',
                Rule::in(array_values(Edge::TYPES)),
            ],
            'meta' => [
                'nullable',
                'array',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'from_node_id.required' => 'Исходный узел обязателен',
            'from_node_id.exists' => 'Исходный узел не найден',

            'to_node_id.required' => 'Целевой узел обязателен',
            'to_node_id.exists' => 'Целевой узел не найден',

            'type.required' => 'Тип связи обязателен',
            'type.in' => 'Недопустимый тип связи',

            'type_en.required' => 'Тип связи обязателен',
            'type_en.in' => 'Недопустимый тип связи',

            'meta.array' => 'Meta должно быть объектом',
        ];
    }

    protected function failedValidation($validator)
    {
        throw new \Illuminate\Validation\ValidationException(
            $validator,
            response()->json([
                'message' => 'Ошибка валидации',
                'errors'  => $validator->errors(),
            ], 422)
        );
    }

    public function authorize(): bool
    {
        return true;
    }
}
