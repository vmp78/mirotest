"use client";

import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewBoardButtonProps {
    orgId: string;
    disable?:boolean;
};

export const NewBoardButton =({
    orgId,
    disable,
}: NewBoardButtonProps)=>{
    const router = useRouter();

    const {mutate, pending} = useApiMutation(api.board.create);

    const onClick = () => {
        mutate({
            orgId,
            title: "Untitle"
        })
        .then((id)=>{
            toast.success("Board created!");
            router.push(`/board/${id}`);
        })
        .catch(()=> toast.error("Failed to  board!"))
    }
    return(
        <button
        disabled={pending || disable}
        onClick={onClick}
        className={cn(
            "col-span-1 aspect-[100/127] bg-white-600 rounded-lg hover:opacity-50  flex flex-col items-center justify-center py-6",
            (pending || disable) && "opacity-75 hover:bg-blue-600 cursor-not-allowed"
        )}
        >
            <div/>
            <Plus className="h-12 w-12 text-black stroke"/>
            <p className="text-sm text-black font-light">
                New Board
            </p>
        </button>
    )
}