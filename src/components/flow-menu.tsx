import React, { useRef, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";

interface MenuItemData {
  text: string;
  image: string;
  description?: string;
  count?: string;
}

interface FlowingMenuProps {
  items?: MenuItemData[];
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
}

interface MenuItemProps extends MenuItemData {
  index: number;
  isFirst: boolean;
  bgColor: string;
  textColor: string;
  hoverBgColor: string;
}

export default function FlowingMenu() {
  const defaultItems: MenuItemData[] = [
    {
      text: "Anime",
      image:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop",
      description: "From classic to modern anime characters",
      count: "150+",
    },
    {
      text: "Pop Culture",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop",
      description: "Movies, music, and internet icons",
      count: "200+",
    },
    {
      text: "Custom",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      description: "Design your own unique stickers",
      count: "∞",
    },
    {
      text: "Gaming",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
      description: "Level up your gear with gaming stickers",
      count: "80+",
    },
    {
      text: "Nature",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      description: "Plants, animals, and natural wonders",
      count: "120+",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <FlowingMenuComponent
        items={defaultItems}
        bgColor="#000000"
        textColor="#ffffff"
        hoverBgColor="#000000"
      />
    </div>
  );
}

const FlowingMenuComponent: React.FC<FlowingMenuProps> = ({
  items = [],
  bgColor = "#ffffff",
  textColor = "#000000",
  hoverBgColor = "#fafafa",
}) => {
  return (
    <div
      className="w-full min-h-screen py-24"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: textColor }}
          >
            All Collections
          </h2>
          <p className="text-zinc-600">Hover over any category to explore</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-0">
          {items.map((item, idx) => (
            <MenuItem
              key={idx}
              {...item}
              index={idx}
              isFirst={idx === 0}
              bgColor={bgColor}
              textColor={textColor}
              hoverBgColor={hoverBgColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  text,
  image,
  description,
  count,
  index,
  isFirst,
  bgColor,
  textColor,
  hoverBgColor,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): "top" | "bottom" => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist =
      Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector(
        ".marquee-part"
      ) as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector(
        ".marquee-part"
      ) as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: 15,
        ease: "none",
        repeat: -1,
      });
    };

    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, image, repetitions]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0);
  };

  return (
    <div
      className="relative overflow-hidden transition-colors"
      ref={itemRef}
      style={{
        borderTop: isFirst ? "none" : "1px solid #e5e5e5",
        backgroundColor: bgColor,
      }}
    >
      <a
        className="group block cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        href="#"
      >
        <div className="flex items-center justify-between py-8 md:py-12">
          <div className="flex items-center gap-8 flex-1">
            <span
              className="text-6xl md:text-7xl font-bold text-zinc-100 group-hover:text-black transition-colors w-24 text-right"
              style={{ color: "#f5f5f5" }}
            >
              0{index + 1}
            </span>

            <div className="flex-1">
              <h3
                className="text-3xl md:text-4xl font-bold mb-2 group-hover:translate-x-2 transition-transform"
                style={{ color: textColor }}
              >
                {text}
              </h3>
              {description && (
                <p className="text-zinc-600 text-sm md:text-base">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {count && (
              <span className="text-sm font-medium text-zinc-400 hidden md:block">
                {count}
              </span>
            )}

            <div className="w-12 h-12 rounded-full border-2 border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </a>

      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-[101%]"
        ref={marqueeRef}
        style={{ backgroundColor: "#000000" }}
      >
        <div className="h-full w-fit flex" ref={marqueeInnerRef}>
          {[...Array(repetitions)].map((_, idx) => (
            <div className="marquee-part flex items-center shrink-0" key={idx}>
              <span className="whitespace-nowrap uppercase font-semibold text-[4vh] leading-none px-[2vw] text-white">
                {text}
              </span>
              <div
                className="w-[15vw] h-[10vh] mx-[2vw] rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
