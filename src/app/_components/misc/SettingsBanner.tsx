"use client";
import Image from "next/image";

interface SettingsBannerProps {
  img: string;
  nameTitle: string;
  subTitle?: string;
}

function SettingsBanner({ img, nameTitle, subTitle }: SettingsBannerProps) {
  return (
    <div className="p-6 flex gap-4 items-center">
      <div className="relative min-w-[4rem] h-full min-h-[4rem] overflow-hidden rounded-full">
        <Image
          src={img}
          alt={subTitle ? "Profile image" : "Room cover image"}
          style={{ objectFit: "cover" }}
          fill={true}
          sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
          className="filter group-hover:brightness-90 transition"
        />
        {!subTitle && img.includes("default") && (
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 uppercase text-h4 text-grey">
            {nameTitle
              .split(" ")
              .map((word) => word.charAt(0))
              .slice(0, 2) //max of 2 letters
              .join("")}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-h5">{nameTitle}</h3>
        {subTitle && <span className="text-xs text-secondary">{subTitle}</span>}
      </div>
    </div>
  );
}

export default SettingsBanner;
