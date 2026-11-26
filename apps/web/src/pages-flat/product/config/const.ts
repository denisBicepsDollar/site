import {Droplets, Sprout, Sun} from "lucide-react";


export const categoryLabel = {
    indoor: 'Комнатные',
    garden: 'Садовые',
};

export const subcategoryLabel = {
    aglaonema: 'Аглаонема',
}

export const formatPrice = (n) =>
    `${new Intl.NumberFormat('ru-RU').format(n)} ₽`;
