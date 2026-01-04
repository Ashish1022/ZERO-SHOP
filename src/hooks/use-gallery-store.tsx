"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface GallerySticker {
    id: string;
    image: string;
    name: string;
    artist: string;
    shape: string;
    material: string;
    size: number;
    createdAt: string;
    likes: number;
    isUserCreation?: boolean;
}

interface GalleryStore {
    stickers: GallerySticker[];
    userStickers: string[]; // IDs of stickers created by current user
    addSticker: (sticker: Omit<GallerySticker, "id" | "createdAt" | "likes">) => void;
    removeSticker: (id: string) => void;
    likeSticker: (id: string) => void;
    getUserStickers: () => GallerySticker[];
}

// Sample community stickers for demo
const INITIAL_STICKERS: GallerySticker[] = [
    {
        id: "demo-1",
        image: "",
        name: "Neon Cat",
        artist: "@neon_dreams",
        shape: "die-cut",
        material: "holographic",
        size: 3,
        createdAt: "2024-12-28T10:00:00Z",
        likes: 42,
    },
    {
        id: "demo-2",
        image: "",
        name: "Pixel Heart",
        artist: "@retro_lover",
        shape: "square",
        material: "matte",
        size: 2,
        createdAt: "2024-12-29T14:30:00Z",
        likes: 28,
    },
    {
        id: "demo-3",
        image: "",
        name: "Kawaii Cloud",
        artist: "@kawaii_club",
        shape: "die-cut",
        material: "glossy",
        size: 4,
        createdAt: "2024-12-30T09:15:00Z",
        likes: 67,
    },
    {
        id: "demo-4",
        image: "",
        name: "Anime Eyes",
        artist: "@manga_master",
        shape: "circle",
        material: "glossy",
        size: 3,
        createdAt: "2024-12-31T16:45:00Z",
        likes: 89,
    },
    {
        id: "demo-5",
        image: "",
        name: "Cyber Wolf",
        artist: "@digital_beast",
        shape: "die-cut",
        material: "holographic",
        size: 5,
        createdAt: "2025-01-01T11:20:00Z",
        likes: 156,
    },
    {
        id: "demo-6",
        image: "",
        name: "Vaporwave Sun",
        artist: "@aesthetic_vibes",
        shape: "circle",
        material: "holographic",
        size: 4,
        createdAt: "2025-01-02T08:00:00Z",
        likes: 73,
    },
];

const useGalleryStore = create<GalleryStore>()(
    persist(
        (set, get) => ({
            stickers: INITIAL_STICKERS,
            userStickers: [],

            addSticker: (stickerData) => {
                const newSticker: GallerySticker = {
                    ...stickerData,
                    id: `user-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    likes: 0,
                    isUserCreation: true,
                };
                set((state) => ({
                    stickers: [newSticker, ...state.stickers],
                    userStickers: [newSticker.id, ...state.userStickers],
                }));
            },

            removeSticker: (id) => {
                set((state) => ({
                    stickers: state.stickers.filter((s) => s.id !== id),
                    userStickers: state.userStickers.filter((sid) => sid !== id),
                }));
            },

            likeSticker: (id) => {
                set((state) => ({
                    stickers: state.stickers.map((s) =>
                        s.id === id ? { ...s, likes: s.likes + 1 } : s
                    ),
                }));
            },

            getUserStickers: () => {
                const state = get();
                return state.stickers.filter((s) => state.userStickers.includes(s.id));
            },
        }),
        {
            name: "zero-shop-gallery",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useGalleryStore;
