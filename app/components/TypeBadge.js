import Image from "next/image";

const TYPE_MAP = {
  Manhwa: { flag: "/korea.png", label: "Manhwa" },
  Manga: { flag: "/japan.png", label: "Manga" },
  Manhua: { flag: "/china.png", label: "Manhua" },
};

export default function TypeBadge({ type, size = "sm" }) {
  const info = TYPE_MAP[type] || TYPE_MAP.Manhwa;

  const sizeClasses = {
    xs: "h-4 gap-1 px-1.5 py-0.5 text-[10px]",
    sm: "h-6 gap-1.5 px-2 py-0.5 text-[10px]",
    md: "h-7 gap-1.5 px-3 py-1 text-xs",
  };

  const imgSizes = {
    xs: 12,
    sm: 14,
    md: 16,
  };

  return (
    <span className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wider bg-dark-700 text-dark-200 border border-dark-600 ${sizeClasses[size]}`}>
      <Image src={info.flag} alt={info.label} width={imgSizes[size]} height={imgSizes[size]} className="rounded-sm object-cover flex-shrink-0" />
      {info.label}
    </span>
  );
}
