import {MinusIcon, CheckIcon} from 'lucide-react'

/**
 * Чекбокс-«галочка»: скрытый input + стилизованный div через peer-классы.
 * Классы перенесены 1:1 из исходника — они НЕ тронуты.
 *
 * variant="dash" — шапка таблицы (минус), variant="check" — строка товара (галка).
 */
export function CheckBox({checked, onChange, variant = 'check'}) {
    const Icon = variant === 'dash' ? MinusIcon : CheckIcon

    return (
        <label className="">
            <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={onChange}
            />

            <div className="border-2 border-gray-300 hover:scale-102 hover:border-gray-400 rounded-md bg-white
                          flex items-center justify-center transition-all duration-200
                          peer-checked:bg-blue-600/80 peer-checked:border-blue-600/80
                          cursor-pointer select-none group hover:brightness-110 active:scale-98
                          ease-out peer-checked:hover:scale-100 peer-checked:hover:border-blue-600/80

                          "
            >
                <Icon className=" w-4 h-4 text-white"/>
            </div>
        </label>
    )
}
