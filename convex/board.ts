import {v} from "convex/values";

import {mutation } from "./_generated/server"; 
import { arch } from "os";

const images = [
    "/placeholder/1.png",
    "/placeholder/2.png",
    "/placeholder/3.png",
    "/placeholder/4.png",
    "/placeholder/5.png",
    "/placeholder/6.png",
    "/placeholder/7.png",
    "/placeholder/8.png",
    "/placeholder/9.png",
    "/placeholder/10.png",
];

export const create = mutation ({
    args: {
        orgId: v.string(),
        title: v.string(),
    },
    handler: async (ctx, args)=> {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Unauthorized");
        }

        const randomImage = images[Math.floor(Math.random() *images.length)];

        const board = await ctx.db.insert("boards",{
            title: args.title,
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            imageUrl: randomImage,
        });

        return board;
    }
})

export const remove = mutation ({
    args: {id: v.id("boards")},
    handler : async (ctx, args)=>{
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Unauthorized");
        }

        const userId = identity.subject;

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_board",(q)=>
                q
                    .eq("userId", userId)
                    .eq("boardId", args.id)
            )
            .unique();

        if(existingFavorite){
            await ctx.db.delete(existingFavorite._id);
        }

        await ctx.db.delete(args.id);
    },
});

export  const update = mutation({
    args: {id: v.id("boards"), title:v.string()},
    handler: async (ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Unauthorized")
        }

        const title=args.title.trim();

        if(!title) {
            throw new Error ("Title is required")
        }

        if(title.length>60) {
            throw new Error("Title cannot be longer than 60 character")
        }

        const board= await ctx.db.patch(args.id,{
            title:args.title,
        })

        return board;
    },
});

export const favorite = mutation({
    args: {id: v.id("boards"), orgId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Unauthorized");
        }

        const board = await ctx.db.get(args.id);

        if(!board) {
            throw new Error("Board not found")
        }

        const userId = identity.subject;

        const existingFavorite= await ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
            q
                .eq("userId", userId)
                .eq("boardId", board._id)
        )
        .unique();

        if(existingFavorite) {
            throw new Error("Board already favorited");
        }
        
        await ctx.db.insert("userFavorites",{
            userId,
            boardId: board._id,
            orgId: args.orgId,
        });

        return board;
    }
})

export const unfavorite = mutation({
    args: {id: v.id("boards")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new Error("Unauthorized");
        }

        const board = await ctx.db.get(args.id);

        if(!board) {
            throw new Error("Board not found")
        }

        const userId = identity.subject;

        const existingFavorite= await ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
            q
                .eq("userId", userId)
                .eq("boardId", board._id)
        )
        .unique();

        if(!existingFavorite) {
            throw new Error("Favorited board not found");
        }
        
        await ctx.db.delete(existingFavorite._id);

        return board;
    }
})