import {Link} from 'react-router-dom'
import {Checkbox} from './Checkbox.jsx'
import {Ellipsis} from 'lucide-react';

export function TableRow({item, selected, onToggle}) {
    return (
        <Link
            to={`${item.id}`}
            className={`
                flex 
                cursor-pointer
                items-center w-full px-4 py-3 text-sm text-stone-900 hover:bg-stone-50/60 
                transition-colors
                ${selected ? "bg-stone-50/60" : "bg-white"}`}
        >
            <Checkbox
                variant="check"
                checked={selected}
                // Останавливаем всплытие клика, чтобы при выборе чекбокса не переходило по ссылке Link
                onChange={(e) => {
                    e.preventDefault();
                    onToggle(item.id);
                }}
            />

            <div className="flex flex-1 pl-5 flex-row gap-3 items-center">
                <img
                    className="w-12 h-12 object-cover rounded-lg"
                    // В JSON у тебя поле называется previewImage, а не image
                    src={item.previewImage || item.image}
                    alt={item.name}
                />
                <div>
                    <p className="font-medium">
                        {item.name}
                    </p>
                    <p className="text-muted text-xs font-medium">
                        {item.sku}
                    </p>
                </div>
            </div>

            <div className="w-2/12 text-center text-muted">{item.category}</div>
            <div className="w-1/12 text-center font-medium">{item.price} ₽</div>
            <div className="w-1/12 text-center">{item.stock} шт.</div>

            {/* 👇 ИСПРАВЛЕНО: Рендерим варианты через .map() вместо вывода объекта напрямую */}
            <div className="w-2/12 text-center text-muted flex gap-1 justify-center flex-wrap">
                {item.variants && item.variants.length > 0 ? (
                    item.variants.map((variant, index) => (
                        <span key={index}
                              className="bg-stone-100 text-[11px] px-1.5 py-0.5 rounded border border-stone-200">
                            {variant.name}
                        </span>
                    ))
                ) : (
                    <span>—</span>
                )}
            </div>

            <div className="w-1/12 text-center">{item.status}</div>
            <div className="w-1/12 text-center text-muted">{item.updated}</div>

            <button
                type="button"
                className="w-1/12 flex shrink-0 justify-end"
                onClick={(e) => {
                    // Тоже останавливаем переход по ссылке при клике на три точки
                    e.preventDefault();
                }}
            >
                <Ellipsis className="text-muted cursor-pointer w-7 h-7 transition-all"/>
            </button>
        </Link>
    )
}
