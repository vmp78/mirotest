"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import  debounce from 'lodash/debounce'
import { useRouter } from "next/navigation";
import {
    ChangeEvent,
    useEffect,
    useState,
    useCallback 
} from "react";

import { Input } from "@/components/ui/input";

export const SearchInput = ()=>{
    const router= useRouter();
    const [value,setValue]=useState("");
    const debouncedUrlChange = useCallback(
        debounce((query: string) => {
            const url = qs.stringifyUrl({
                url: '/',
                query: {
                    search: query,
                },
            }, { skipEmptyString: true, skipNull: true });

            router.push(url);
        }, 500),
        [router]
    );
    
    const handleChange=(e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        if (value) {
            debouncedUrlChange(value);
        }
    },  [value, debouncedUrlChange]);

    return(
        <div className="w-full relative">
            <Search
            className="absolute top-1/2 left-3 transform -translate-y-1/2
            text-mute-foreground h-4 w-4"
            />
            <Input 
            type="text"
            className="w-full max-w-[516px] pl-9"
            placeholder="Search"
            onChange={handleChange}
            value={value}
            />
        </div>
    )
}