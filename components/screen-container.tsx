import { ImageBackground, View, type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

const WOOD_BG = require("@/assets/images/wood-bg.jpg");

// Overlay opacity: 0 = pure texture, 1 = pure color. 0.55 keeps grain visible
// while ensuring WCAG-AA contrast for all text on top.
const OVERLAY_OPACITY = 0.55;

export interface ScreenContainerProps extends ViewProps {
  edges?: Edge[];
  className?: string;
  containerClassName?: string;
  safeAreaClassName?: string;
}

export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  style,
  ...props
}: ScreenContainerProps) {
  return (
    <ImageBackground
      source={WOOD_BG}
      style={{ flex: 1 }}
      resizeMode="cover"
      {...props}
    >
      {/* Dark tint overlay so text is always readable over the grain */}
      <View
        style={{
          flex: 1,
          backgroundColor: `rgba(18, 10, 4, ${OVERLAY_OPACITY})`,
        }}
      >
        <SafeAreaView
          edges={edges}
          className={cn("flex-1", safeAreaClassName)}
          style={style}
        >
          <View className={cn("flex-1", className)}>{children}</View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}
