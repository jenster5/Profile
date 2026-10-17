import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const MOBILE_PANEL_POSITION = { left: "4%", top: "12dvh" };
export const MOBILE_PANEL_SIZE = { width: "92%", height: "76dvh" };

// Mobile panels live outside the animated room so viewport sizing stays stable.
export default function MobileStationPanel({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  return isMobile ? createPortal(children, document.body) : <>{children}</>;
}