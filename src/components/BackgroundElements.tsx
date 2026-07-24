import { useTheme } from "../context/ThemeContext";

export function BackgroundElements() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">
      {theme === 'dark' ? (
        <>
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,var(--primary-color),transparent_60%)] opacity-20" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,var(--secondary-color),transparent_60%)] opacity-10" />
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,var(--accent-color),transparent_60%)] opacity-15" />
        </>
      ) : (
        <>
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent_70%)]" />
          <div className="absolute top-[10%] -right-[20%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.07),transparent_70%)]" />
          <div className="absolute -bottom-[20%] left-[10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.1),transparent_70%)]" />
        </>
      )}
    </div>
  );
}
