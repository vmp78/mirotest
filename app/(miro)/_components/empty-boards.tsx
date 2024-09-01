"use client ";

import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export const EmptyBoards=()=>{
    const router = useRouter();
    const { organization}= useOrganization();
    const mutate= useMutation(api.board.create);

    const onClick =() =>{
        if(!organization) return;

        mutate({
            orgId: organization.id,
            title:"Untitle"
        })
            .then((id)=>{
                toast.success("Board created!");
                router.push(`/board/${id}`);
            })
            .catch(()=> toast.error("Failed to create board!"))
    };

    return(
        <div className="h-full flex flex-col items-center justify-center">
            <Image
            src="/empty-board.png"
            height={240}
            width={240}
            alt="Empty"
            />
            <h2 className="text-2xl font-semibold mt-6">
                Create your first board!
            </h2>
            <p className="text-muted-foreground textg-sm mt-2">
                Start by creating a board for your organization
            </p>
            <div className="mt-6">
                <Button  onClick={onClick} size="lg">
                    Create board
                </Button>
            </div>
        </div>
    )
}