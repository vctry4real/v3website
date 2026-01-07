"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

    return (
        <>
            {!isAdminRoute && <Header />}
            <main>{children}</main>
            {!isAdminRoute && <Footer />}
        </>
    );
};
