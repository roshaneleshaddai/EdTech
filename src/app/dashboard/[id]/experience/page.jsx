// src/app/dashboard/[id]/experience/page.jsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Experience } from "@/components/Experience";

export default function ExperiencePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id;

    return (
        <div className=" bg-gray-50 text-gray-900">
            <div className="absolute top-3 left-3 z-50">
                <button
                    onClick={() => router.push(`/dashboard/${courseId}`)}
                    className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 bg-white/80 rounded-lg border border-gray-200 hover:bg-white transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                    </svg>
                    Back to Course
                </button>
            </div>
            <div className="">
                <Experience />
            </div>
        </div>
    );
}


