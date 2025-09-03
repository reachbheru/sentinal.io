import { Geist, Geist_Mono } from "next/font/google";
import SideBar from '@/components/app/Side-bar'
import NavBar from '@/components/nav-bar/nav-bar'
import '@/app/globals.css'

// Use variables as required
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        // <html lang="en">
        // <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-row`}>
        // <SideBar />
        // {children}
        // </body>
        // </html>
        <div className='flex'>
            <SideBar />
            <div className='flex-col flex w-full h-screen' >
                <NavBar />
                <main >{children}</main>
            </div>
        </div>
    );
}
