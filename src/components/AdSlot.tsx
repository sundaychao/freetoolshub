"use client";

import { useEffect } from "react";
import { siteConfig } from "@/site.config";

// 为 window.adsbygoogle 补充类型声明
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
};

/**
 * AdSense 广告位组件。
 * - 当 siteConfig.adsense.enabled 为 true 时，渲染真实广告并推送 adsbygoogle。
 * - 否则渲染一个占位灰框，方便开发预览。
 */
export function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdSlotProps) {
  useEffect(() => {
    if (!siteConfig.adsense.enabled) return;
    try {
      ((window.adsbygoogle = window.adsbygoogle || []) as unknown[]).push({});
    } catch (error) {
      console.error("AdSense push failed:", error);
    }
  }, []);

  // 未启用：渲染占位框
  if (!siteConfig.adsense.enabled) {
    return (
      <div
        className={`flex min-h-[120px] w-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-100 text-center text-sm text-zinc-500 ${className}`}
      >
        Ad placeholder &mdash; enabled when AdSense approved
      </div>
    );
  }

  // 已启用：渲染真实广告单元
  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={siteConfig.adsense.client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}

export default AdSlot;
