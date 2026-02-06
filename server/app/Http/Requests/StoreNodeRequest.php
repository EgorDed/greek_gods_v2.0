<?php

namespace App\Http\Requests;

use App\Models\Node;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNodeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'code'  => ['required', 'string', 'unique:nodes,code'],
            'title' => ['required', 'string'],
            'type'  => ['required',
                Rule::in(array_keys(Node::TYPES)),
            ],
            'type_en' => [
                'required',
                Rule::in(array_values(Node::TYPES)),
            ],
            'short_description' => ['required', 'string'],
            'description'       => ['required', 'string'],
            'meta'              => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Код обязателен',
            'code.unique'   => 'Такой код уже существует',
            'title.required' => 'Заголовок обязателен',
            'type.required' => 'Тип обязателен',
            'type.in'       => 'Недопустимый тип сущности',
            'type_en.required' => 'Тип обязателен',
            'type_en.in'       => 'Недопустимый тип сущности',
            'short_description.required' => 'Краткое описание обязательно',
            'description.required'       => 'Описание обязательно',
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
