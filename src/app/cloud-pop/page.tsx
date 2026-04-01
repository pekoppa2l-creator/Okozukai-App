import type { Metadata } from "next";
import { CloudPopBoard } from "@/components/cloud-pop-board";

export const metadata: Metadata = {
  title: "Cloud Pop",
  description: "A quiet digital bubble wrap break built with Next.js, Tailwind, and Framer Motion.",
};

export default function CloudPopPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <CloudPopBoard />
    </main>
  );
}