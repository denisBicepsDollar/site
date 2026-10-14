/* ============================================================================
   useProductForm — вся «умная» часть страницы товара в одном хуке.

   Хук ничего не рисует: он хранит состояние формы, умеет его менять
   и сообщает, есть ли несохранённые изменения. Компоненты-секции получают
   отсюда готовые значения и колбэки.
   ============================================================================ */

import {useEffect, useMemo, useRef, useState} from 'react';
import {findGoodById} from '../constants.js';


export function useOrderForm(id) {
    const item = useMemo(() => findGoodById(id), [id]);

    const [form, setForm] = useState(() => createFormState(item));
    const [savedSnapshot, setSavedSnapshot] = useState(() => buildSnapshot(createFormState(item)));

    /* blob-ссылки на загруженные файлы, чтобы не течь при размонтировании */
    const objectUrlsRef = useRef(new Set());

    /* Чистим blob-ссылки, когда уходим со страницы */
    useEffect(() => () => {
        objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        objectUrlsRef.current.clear();
    }, []);


    return {
        item,

        /* Поля формы */
        name: form.name,
        description: form.description,
        status: form.status,
        category: form.category,
        basePrice: form.basePrice,
        note: form.note,
        cover: form.cover,
        variants: form.variants,
    };
}