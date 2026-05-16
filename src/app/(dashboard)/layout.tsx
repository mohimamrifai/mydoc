import Sidebar from "@/components/shared/sidebar";
import Header from "@/components/shared/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="ml-14 md:ml-56 flex-1">
                {/* Header */}
                <Header />
                <main className="md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}