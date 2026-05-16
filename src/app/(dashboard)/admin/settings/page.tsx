import SettingPageComponent from "@/components/shared/setting-page-component";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {

  let formattedData = {
    companyName: "",
    address: "",
    phone: "",
    email: "",
    logoUrl: "",
  }
  const generalSetting = await prisma.generalSetting.findFirst();
  const socialMedia = await prisma.socialMedia.findMany();

  if (generalSetting) {
    formattedData = {
      companyName: generalSetting.companyName,
      address: generalSetting.address,
      phone: generalSetting.phone,
      email: generalSetting.email,
      logoUrl: generalSetting.logoUrl,
    }
  } else {
    formattedData = {
      companyName: "",
      address: "",
      phone: "",
      email: "",
      logoUrl: "",
    }
  }

  const socialMediaData = socialMedia.map((social) => ({
    name: social.name as "facebook" | "twitter" | "instagram" | "youtube" | "linkedin",
    url: social.url,
  }));

  return (
    <SettingPageComponent {...formattedData} socialMediaData={socialMediaData} />
  );
}

