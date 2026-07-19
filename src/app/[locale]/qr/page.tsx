import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import QRCode from "qrcode";
import { Logo } from "@/components/site/logo";

export default async function QrPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/`;

  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 480,
    color: { dark: "#0b3d2e", light: "#ffffff" },
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-[var(--jt-green-900)] px-4 py-16 text-white">
      <Logo className="text-white" />
      <div className="rounded-3xl bg-white p-6 shadow-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrDataUrl} alt="QR code" width={320} height={320} />
      </div>
      <p className="text-sm text-white/70">{url}</p>
    </div>
  );
}
