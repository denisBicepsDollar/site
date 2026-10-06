import {Search, X} from 'lucide-react'

export function SearchByName({searchQuery, setSearchQuery}) {
    return (<label className="
            flex
            flex-row
            border-2
            items-center
            rounded-xl
            p-2
            w-55
            cursor-text
            transition-all duration-200
            border-border2
            focus-within:shadow-md focus-within:shadow-blue-600/20
        ">
        <Search className=" w-5 mr-2"/>

        <input
            className="outline-none w-full bg-transparent"
            type="text"
            placeholder="Название, артикул..."
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value)
            }}
        />
        <X className={`${searchQuery ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
                         transition-all duration-200 w-7 p-1 h-7 flex items-center justify-center rounded-full 
                         cursor-pointer hover:bg-muted/20 hover:brightness-110 active:scale-98`}
           onClick={() => setSearchQuery('')}
        />
    </label>);

}
