"use client ";

import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Skeleton } from "@/components/ui/skeleton";

import { Overlay } from "./overlay";
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Actions } from "@/components/actions";

interface BoardCardProps {
    id: string;
    title: string;
    authorName: string;
    authorId: string;
    createAt: number;
    imageUrl: string;
    orgId: string;
    isFavorite: boolean;
};


export const BoardCard = ({
    id,
    title,
    authorName,
    authorId,
    createAt,
    imageUrl,
    orgId,
    isFavorite,
}: BoardCardProps) => {
    const {userId} = useAuth ();

    const authorLabel = userId === authorId ? "You": authorName;
    const createAtLabel = formatDistanceToNow(createAt,{
        addSuffix: true,
    });

    const {
        mutate: onFavorite,
        pending: pendingFavorite,
    }= useApiMutation(api.board.favorite);
    const {
        mutate: onUnFavorite,
        pending: pendingUnfavorite,
    }= useApiMutation(api.board.unfavorite);

    const toggleFavorite =()=>{
        if(isFavorite){
            onUnFavorite({id})
            .catch(()=> toast.error("Failed to unfavorite"))
        }else{
            onFavorite({id, orgId })
            .catch(()=> toast.error("Failed to favorite"))
        }
    }

    return ( // {<Link href={`/board/${id}`}>}
            <div className="group aspect-[100/127] border rounded-lg flex
            flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Link href={`/board/${id}`}>
                        <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-fit"
                        />
                        <Overlay/>
                    </Link>
                    <Actions
                    id={id}
                    title={title}
                    side="right"
                    >
                        <button className="absolute top-1 right-1 opacity-0
                        group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
                            <MoreHorizontal className="text-white opacity-75
                            hover:opacity-100 transition-opacity"/>
                        </button>
                    </Actions>
                </div>
                
                <Link href={`/board/${id}`}>
                    <Footer
                    isFavorite={isFavorite}
                    title ={title}
                    authorLabel={authorLabel}
                    createAtLabel={createAtLabel}
                    onClick={toggleFavorite}
                    disabled ={pendingFavorite||pendingUnfavorite}
                    />
                </Link>
            </div>
    )
};

BoardCard.Skeleton = function BoardCardSkeleton () {
    return(
        <div className="aspect-[100/127] rounded-lg flex overflow-hidden">
            <Skeleton className="h-full w-full"/>
        </div>
    )
}