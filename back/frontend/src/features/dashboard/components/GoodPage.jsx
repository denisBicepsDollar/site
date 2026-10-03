import {Link, useNavigate, useParams} from "react-router-dom";
import {PageButton} from "../../../shared/components/Ui.jsx";
import {use, useState} from "react";

const goods = [// --- КОМНАТНЫЕ РАСТЕНИЯ (Варианты: D5, D7, D10) ---
    {
        id: 2, name: "Фикус Лирата", sku: "PL-002", category: "Комнатные", price: "4 800 ₽",
        stock: 1, status: "warning", updated: "Вчера", description: "the best good",

        // 1. Явно указываем главное фото (превью для карточки/списка)
        previewImage: "/1.png",

        variants: [{
            name: "D7", previewImage: "/2.png", stock: 5, price: 5000, images: ["/2.png", "/3.png", "/4.png", "/4.png"]
        }, {
            name: "D10", previewImage: "/4.png", stock: 3, price: 2000, images: ["/4.png", "/1.png"]
        }]
    }];


const inDoor = ['D5', 'D7', 'D10'];
const outDoor = ['P9', 'C1', 'C2'];


export function GoodPage() {
    const maxNameLength = 100;
    const maxDescriptionLength = 200;
    const {id} = useParams();
    const [item] = goods.filter(elem => elem.id === Number(id));
    const [currentDescription, setCurrentDescription] = useState(item.description);
    const [currentName, setCurrentName] = useState(item.name);
    const [selectedStatus, setSelectedStatus] = useState(item.status);
    const [currentCategory, setCurrentCategory] = useState(item.category);
    const [showCategoryList, setShowCategoryList] = useState(false);

    const navigate = useNavigate();
    let variants = item.category === 'Комнатные' ? inDoor : outDoor
    const statusList = ['active', 'inactive', 'warning']
    const categories = ['Комнатные', 'Садовые'];


    return (<div>
        <div
            className="
                  flex
                  p-5
                  border-b-2
                  border-b-border2
                  bg-white
                  items-center


                  ">
            <div
                className="
                    flex flex-row flex-1
                    items-center
                    gap-3"
            >
                <PageButton text="К товарам" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round"
                         className="w-5 h-5">
                        <path d="m12 19-7-7 7-7"/>
                        <path d="M19 12H5"/>
                    </svg>
                </PageButton>
                <span className="font-medium">
                      /
                  </span>
                <span className="font-medium">
                      {currentName}
                  </span>
            </div>
            <div
                className="
                      flex flex-row
                      items-center">
                      <span>
                          Изменений нет/Изменения не сохранены
                      </span>
                <PageButton text="Сохранить">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round"
                         className="lucide lucide-save preview-icon">
                        <path
                            d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
                        <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/>
                        <path d="M7 3v4a1 1 0 0 0 1 1h7"/>
                    </svg>
                </PageButton>
            </div>
        </div>


        <div className="flex mx-auto p-5 gap-5 bg-muted/10 min-h-screen">

            <div
                className="
                flex
                flex-col
                flex-1
                gap-3
                min-w-0
                w-full
                lg:w-3/4


                ">
                {/* Первая секция */}
                <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
                    {/* Заголовок */}
                    <div className="flex gap-2">
                        <label className="text-xs font-semibold uppercase text-zinc-500">
                            Название товара
                        </label>
                        <span className="text-[10px] font-medium text-red-500">*</span>
                    </div>

                    <label
                        className="group flex items-center gap-3 rounded-lg
                        border border-zinc-200 bg-zinc-50/50 p-3
                        transition-all focus-within:border-zinc-900 focus-within:bg-white
                        focus-within:ring-1 focus-within:ring-zinc-900">
                        <input
                            className="flex-1 bg-transparent text-[22px] font-medium
                            leading-none text-zinc-900 placeholder:text-zinc-300
                            focus:outline-none"
                            placeholder="Например, Фикус Литара"
                            value={currentName}
                            maxLength={maxNameLength}
                            onChange={(e) => setCurrentName(e.target.value)}
                        />
                        <span className="shrink-0 text-xs tabular-nums text-zinc-400">
                          {currentName.length} / {maxNameLength}
                        </span>
                    </label>


                    <div
                        className={"flex flex-wrap gap-6 justify-between"}
                    >
                        {/* Мета */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-zinc-400">Артикул:</span>
                                <span className="font-semibold text-zinc-900">{item.sku}</span>
                            </div>
                            <div className="h-5 w-px bg-zinc-200"/>
                            {/* разделитель */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-zinc-400">Обновлен:</span>
                                <span className="font-medium text-zinc-700">{item.updated.toLowerCase()}</span>
                            </div>
                            {/* разделитель */}
                            <div className="h-5 w-px bg-zinc-200"/>

                            <div className="flex items-center gap-1.5">
                                <span className="text-zinc-400">Вариантов:</span>
                                <span
                                    className="inline-flex h-5 min-w-5 items-center justify-center
                                    rounded-full bg-zinc-900 px-1.5 text-xs font-bold text-white">
                              {item.variants.length}
                            </span>
                            </div>
                            {/* разделитель */}
                            <div className="h-5 w-px bg-zinc-200"/>

                            {/* Категория */}
                            <div className="flex gap-2 items-center">
                                <label className="text-zinc-400">
                                    Категория:
                                </label>
                                <button
                                    onClick={() => setShowCategoryList(!showCategoryList)}
                                    className="flex items-center justify-between gap-2 rounded-lg border
                                    border-zinc-200 bg-white p-2 text-sm font-medium hover:bg-zinc-50
                                    [anchor-name:--btn]
                                ">
                                <span
                                    className="truncate">
                                    {currentCategory}
                                </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none"
                                         stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round"
                                         className={`w-5 h-5  text-zinc-400 transition-transform ${showCategoryList ? "rotate-180" : ""} `}>
                                        <path d="m6 9 6 6 6-6"/>
                                    </svg>
                                </button>

                                <div className={`
                                    absolute z-20 flex max-h-60 w-[anchor-size(width)] flex-col overflow-auto rounded-xl 
                                    border 
                                    border-zinc-200 bg-white shadow-lg
                                    [position-anchor:--btn] top-[anchor(bottom)] left-[anchor(left)] mt-2
                                    transition-all duration-150
                                  ${showCategoryList ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}
                                    `}>
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            className="flex
                                        cursor-pointer
                                        w-full items-center justify-between p-3 text-left text-sm
                                         hover:bg-zinc-50"
                                            onClick={() => {
                                                setShowCategoryList(false);
                                                setCurrentCategory(category);
                                            }}
                                        >
                                        <span
                                            className="whitespace-nowrap ">
                                            {category}
                                        </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24"
                                                 fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round"
                                                 stroke-linejoin="round"
                                                 className={`text-zinc-500  w-5 h-5 ${category === currentCategory ? 'opacity-100' : 'opacity-0'
                                                 }`}>
                                                <path d="M20 6 9 17l-5-5"/>
                                            </svg>
                                        </button>))}
                                </div>
                            </div>

                            {/* разделитель */}
                            <div className="h-5 w-px bg-zinc-200"/>

                            {/* Ценник */}
                            <div className={`flex items-center gap-2`}>
                                <span className="text-zinc-400">
                                    Базовая цена:
                                    <span
                                        className="ml-0.5 text-red-500">
                                        *
                                    </span>
                                </span>
                                <label
                                    className="
                                    flex items-center  rounded-lg border border-zinc-200
                                    bg-white p-2 focus-within:border-zinc-900 focus-within:ring-1
                                    focus-within:ring-zinc-900
                                ">
                                    <input type="number"
                                           className="
                                                bg-transparent w-20
                                                font-medium tabular-nums outline-none placeholder:text-zinc-300"
                                           placeholder="0"
                                    />
                                    <span className="text-zinc-400">₽</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`
                    bg-white 
                    rounded-xl
                    p-3
                    flex
                    flex-col
                    gap-3
                    
                    `}>
                      <span
                          className="
                          flex
                          font-medium
                          text-sm
                          uppercase
                          ">
                          Описание
                      </span>
                    <textarea
                        className="w-full min-h-[120px] border-2 border-border2 bg-white rounded-xl p-2
                           outline-none resize-none transition-colors duration-200
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={currentDescription}
                        onChange={(e) => setCurrentDescription(e.target.value)}
                        placeholder="Введите описание товара..."
                        maxLength={200}
                    >
                      </textarea>

                    <span className={`flex ml-2 flex-row whitespace-nowrap text-muted items-end text-xs`}>
                        {currentDescription.length} / {maxDescriptionLength}
                    </span>
                </div>

                <div className={`
                    bg-white 
                    rounded-xl
                    p-3
                    flex
                    flex-col
                    gap-3
                    `}>
                    <div>
                        <span
                            className="
                          flex
                          font-medium
                          text-sm
                          uppercase
                          ">
                          Фотографии
                      </span>
                        <span
                            className="
                              flex
                              font-medium
                              text-sm
                              text-muted
                              ">
                              Выберите или загрузите фотографию для обложки карточки
                        </span>
                        <div
                        >
                            <span
                                className="
                              flex
                              font-medium
                              text-sm
                              text-muted
                              ">
                                Текущая обложка
                            </span>
                            <div className="flex gap-3">
                                {/* Картинка текущей обложки */}
                                <img
                                    className="w-20 h-20 object-cover rounded-xl border border-border2"
                                    src={item.previewImage}
                                    alt="Превью"
                                />

                                {/* Кастомная кнопка загрузки */}
                                <label
                                    className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-border2 hover:border-blue-500 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <span className="text-xl text-muted font-light">+</span>
                                    <span className="text-[10px] font-medium text-muted uppercase">Фото</span>

                                    {/* Сам инпут скрываем через hidden */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            /* здесь будет твоя функция загрузки */
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <hr/>

                    <div>
                        <div>
                            <span
                                className="
                              flex
                              font-medium
                              text-sm
                              text-muted

                              ">

                              Фотографии D7
                            </span>
                            <div className={`flex gap-3`}>
                                <img
                                    className={`w-20 h-20 object-cover rounded-xl`}
                                    src={item.variants[0].images[0]}
                                />
                                <img
                                    className={`w-20 h-20 object-cover rounded-xl`}
                                    src={item.variants[0].images[1]}
                                />
                            </div>


                        </div>
                        <div
                        >
                            <span
                                className="
                              flex
                              font-medium
                              text-sm
                              text-muted

                              ">

                              Фотографии D10
                            </span>
                            <div className={`flex gap-3`}>
                                <img
                                    className={`w-20 h-20 object-cover rounded-xl`}
                                    src={item.variants[1].images[0]}
                                />
                                <img
                                    className={`w-20 h-20 object-cover rounded-xl`}
                                    src={item.variants[1].images[1]}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div
                    className="
                      bg-white
                        rounded-xl
                        p-3
                        flex
                        flex-col
                        gap-3
                        border-2
                        border-border2"
                >
                    <div className={`flex flex-row gap-3`}>
                        <span
                            className="
                          flex
                          font-medium
                          text-sm
                          uppercase

                          ">
                          варианты и количество
                      </span>
                        <span
                            className="
                          flex
                          font-medium
                          text-sm
                          text-muted

                          ">
                          текущие варианты: 2
                      </span>
                    </div>

                    <div
                        className="
                            flex
                            gap-3
                            rounded-lg
                            flex-col


                          ">
                        <div className={`flex gap-3 flex-col bg-muted/10 p-3 border-2 rounded-lg border-border2`}>
                            <div className="flex gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 24 24"
                                     fill="none"
                                     stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                     stroke-linejoin="round"
                                     className="lucide lucide-sparkles preview-icon">
                                    <path
                                        d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
                                    <path d="M20 2v4"/>
                                    <path d="M22 4h-4"/>
                                    <circle cx="4" cy="20" r="2"/>
                                </svg>
                                <span>
                                    Быстро добавить варианты
                                </span>
                            </div>

                            <div
                                className="
                                    flex
                                    gap-3

                                    ">
                                {variants.map(variant => (<PageButton text={variant} className="bg-white">
                                </PageButton>))}
                            </div>

                        </div>
                        {/* чекнуть стили вот тут*/}
                        <div className="
                              flex

                              gap-5
                              border-b-2
                              py-1
                              text-muted
                                 ">
                            <div className={`flex justify-center w-1/16 `}>
                                Размер
                            </div>

                            <div className={`flex justify-center  w-1/8`}>
                                Остаток
                            </div>
                            <div className={`flex justify-center  w-1/8`}>
                                Своя цена
                            </div>
                            <div className={`flex justify-center  flex-1`}>
                                Фотографии
                            </div>
                        </div>
                        <div className="
                              flex
                              gap-
                              flex-col
                              overflow-hidden
                                 ">

                            {item.variants.map(({name, stock, price, images, previewImage}) => (

                                <div
                                    className="
                                        flex
                                        flex-row
                                        py-3
                                        items-center
                                        gap-3
                                        outline-1
                                        outline-border2
                                        ">
                                    {/*
                                    Размер
                                */}
                                    <input
                                        className={`py-3  outline-0 text-center border w-1/16 rounded-xl border-border focus-within:border-blue-500`}
                                        value={name}

                                    />
                                    {/*
                                    Остаток
                                */}

                                    <div
                                        className={`flex flex-row justify-between  w-1/8 focus-within:border-blue-500`}>

                                        {/*
                                        Кнопка минус
                                    */}
                                        <button
                                            className={`flex border rounded-xl rounded-r-none justify-center cursor-pointer hover:brightness-102 active:scale-98 py-3 w-3/8 border-r-1 items-center  border-border`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="">
                                                <path d="M5 12h14"/>
                                            </svg>
                                        </button>
                                        {/*
                                        Конкретно число
                                    */}
                                        <input
                                            type="number"
                                            className={`text-center outline-0 border-y-1 border-border   w-2/8`}
                                            value={stock}
                                        />
                                        {/*
                                        Кнопка плюс
                                    */}
                                        <button
                                            className={`flex border rounded-xl rounded-l-none justify-center cursor-pointer hover:brightness-102 active:scale-98 py-3 w-3/8 border-r-1 items-center  border-border`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="lucide lucide-plus preview-icon">
                                                <path d="M5 12h14"/>
                                                <path d="M12 5v14"/>
                                            </svg>
                                        </button>
                                    </div>
                                    {/*
                                    ценник
                                */}

                                    <input
                                        type="number"
                                        className={`text-center  border w-1/8 py-3  rounded-xl border-border`}
                                        value={price}
                                    />
                                    {/*
                                    Контейнер с фотками
                                */}

                                    <div className={`flex gap-3 flex-row flex-1 p-1 rounded-xl border-border border`}>
                                        {images.map(image => (<div
                                            key={image}
                                            className={`relative w-25 h-24 flex-shrink-1 overflow-hidden rounded-lg`}>
                                            <img src={image} className="w-full h-full object-cover"
                                                 alt="preview"/>
                                            {/*
                                                    логика если это обложка
                                                */}
                                            {image === previewImage && (<div
                                                className="absolute inset-0 flex items-end">
                                                                <span
                                                                    className="text-white text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-black/30">
                                                                    Обложка
                                                                </span>
                                            </div>)}
                                        </div>))}
                                        {/*
                                        Добавление фотки
                                    */}
                                        {images.length != 4 && (<label
                                            className=" w-25 h-24 flex flex-col items-center justify-center border-2 border-dashed border-border2 hover:border-blue-500 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                            <span className="text-xl text-muted font-light">+</span>
                                            <span
                                                className="text-[10px] font-medium text-muted uppercase">Фото</span>

                                            {/* Сам инпут скрываем через hidden */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    /* здесь будет твоя функция загрузки */
                                                }}
                                            />
                                        </label>)}
                                    </div>

                                    {/*
                                    мусорка для удаления
                                */}
                                    <div className={`flex justify-center ml-auto  w-1/32 `}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                             stroke-linejoin="round" className="w-5 h-5">
                                            <path d="M10 11v6"/>
                                            <path d="M14 11v6"/>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                            <path d="M3 6h18"/>
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                        </svg>
                                    </div>
                                </div>))}
                        </div>
                    </div>
                </div>
            </div>

            <aside className="
                    flex
                    flex-col
                    gap-3
                    w-1/4
                    ">

                <div className="flex flex-col border border-border2 rounded-xl p-5 bg-white"


                >
                    <span
                        className="
                          flex
                          font-medium
                          text-sm
                          uppercase
                          text-muted


                          ">
                          Статус
                    </span>
                    <div className="flex flex-col gap-1">
                        {statusList.map(status => (<label className={`
                                flex flex-row 
                                gap-3 p-2
                                ${selectedStatus === status ? ' border-2 border-border2 rounded-xl bg-muted/10' : ' border-2 border-white'}
                                
                                `}>
                            <input
                                type="radio"
                                name="statusRadioGroup"
                                checked={selectedStatus === status}
                                value={status}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            />
                            <span>
                                            {status}
                                        </span>
                        </label>))}
                    </div>
                </div>


                <div className="flex gap-4 p-4 flex-col border bg-white border-border2 rounded-xl ">
                    <div className={`flex flex-row items-center gap-3 justify-start`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="flex w-5 transform translate-y-[2px] h-5 shrink-0 text-muted">
                            <path d="m18 15-6-6-6 6"/>
                        </svg>
                        <span className="
                          flex
                          font-medium
                          text-sm
                          ">Заметки
                        </span>
                    </div>

                    <hr className={`border-border2`}/>

                    <div className={`flex flex-row items-baseline gap-1 justify-start whitespace-nowrap`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round"
                             stroke-linejoin="round"
                             className="flex w-5 h-5  translate-y-[2px] whitespace-nowrap text-muted ">
                            <path
                                d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/>
                            <path d="M14 2v5a1 1 0 0 0 1 1h5"/>
                        </svg>
                        <span className={`flex text-muted text-xs`}>
                            Внутренняя заметка
                        </span>
                    </div>

                    <textarea
                        className="w-full  min-h-[70px] border-2 border-border2 bg-white rounded-xl p-2

                           outline-none resize-none transition-colors duration-200
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={currentDescription}
                        onChange={(e) => setCurrentDescription(e.target.value)}
                        placeholder="Введите описание товара..."
                        maxLength={200}
                    >
                      </textarea>


                </div>
                <PageButton text="Удалить товар" className={`bg-red text-white`} variant="danger">
                </PageButton>
            </aside>
        </div>
    </div>);
}