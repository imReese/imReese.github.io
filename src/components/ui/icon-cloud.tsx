"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud";

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 12,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
    // dragControl: false,
  },
};

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510";
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  });
};

export type DynamicCloudProps = {
  iconSlugs: string[];
};

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;
export default function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const { theme } = useTheme();

  // 使用Intersection Observer实现懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // 当10%可见时开始加载
    );

    const cloudContainer = document.getElementById('icon-cloud-container');
    if (cloudContainer) {
      observer.observe(cloudContainer);
    }

    return () => {
      if (cloudContainer) {
        observer.unobserve(cloudContainer);
      }
    };
  }, []);

  useEffect(() => {
    if (shouldRender) {
      fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
    }
  }, [iconSlugs, shouldRender]);

  const renderedIcons = useMemo(() => {
    if (!shouldRender) {
      return (
        <div
          id="icon-cloud-container"
          className="flex h-56 w-full items-center justify-center"
        >
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-border bg-secondary/60">
            <div className="absolute h-24 w-24 animate-pulse rounded-full border border-primary/25" />
            <div className="h-14 w-14 rounded-full bg-primary/15" />
          </div>
        </div>
      );
    }

    if (!data) {
      // 数据加载中显示骨架屏
      return Array.from({ length: iconSlugs.length }, (_, i) => (
        <div key={i} className="animate-pulse bg-muted rounded-full w-12 h-12" />
      ));
    }

    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, theme || "light"),
    );
  }, [data, theme, iconSlugs.length, shouldRender]);

  // 懒加载优化：仅在视口可见时渲染
  if (!shouldRender) {
    return renderedIcons;
  }

  return (
    <div id="icon-cloud-container">
      {/* @ts-ignore */}
      <Cloud {...cloudProps}>
        <>{renderedIcons}</>
      </Cloud>
    </div>
  );
}
