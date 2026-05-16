import Link from "next/link";
import Logo from "./logo";
import { prisma } from "@/lib/prisma";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

async function getGeneralSettings() {
    const settings = await prisma.generalSetting.findFirst();
    return settings;
}

async function getSocialMedia() {
    const socialMedia = await prisma.socialMedia.findMany();
    return socialMedia;
}

async function getCategories() {
    const categories = await prisma.category.findMany({
        take: 4,
    });
    return categories;
}

export default async function Footer() {
    const settings = await getGeneralSettings();
    const socialMedia = await getSocialMedia();
    const categories = await getCategories();

    return (
        <footer className="bg-background text-foreground border-t">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-1">
                        <Logo />
                        <p className="text-sm text-muted-foreground mt-2">
                            Platform pembelajaran medis terdepan untuk tenaga kesehatan Indonesia.
                        </p>
                        {settings && (
                            <div className="mt-4 text-sm text-muted-foreground">
                                <p>{settings.address}</p>
                                <p>{settings.phone}</p>
                                <p>{settings.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Layanan</h3>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link href={`/search?category=${category.name}`} className="text-sm text-muted-foreground hover:text-foreground">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">Perusahaan</h3>
                        <ul className="space-y-2">
                            <li><Link href="/tentang-kami" className="text-sm text-muted-foreground hover:text-foreground">Tentang Kami</Link></li>
                            <li><Link href="/kontak" className="text-sm text-muted-foreground hover:text-foreground">Kontak</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="font-semibold mb-4">Ikuti Kami</h3>
                        <div className="flex space-x-4">
                            {socialMedia?.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    className="text-muted-foreground hover:text-foreground"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.name === 'facebook' && <Facebook className="w-5 h-5" />}
                                    {social.name === 'twitter' && <Twitter className="w-5 h-5" />}
                                    {social.name === 'instagram' && <Instagram className="w-5 h-5" />}
                                    {social.name === 'youtube' && <Youtube className="w-5 h-5" />}
                                    {social.name === 'linkedin' && <Linkedin className="w-5 h-5" />}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} {settings?.companyName || 'MyDoc'}. Hak Cipta Dilindungi.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Kebijakan Privasi</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
