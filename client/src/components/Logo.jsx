export default function Logo({ size = 28, light = false }) {
  return (
    <span style={{
      fontSize: size,
      fontWeight: 800,
      background: light
        ? 'linear-gradient(135deg, #6366F1, #EC4899)'
        : 'linear-gradient(135deg, #A78BFA, #F472B6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      userSelect: 'none',
      fontFamily: 'Inter, sans-serif',
    }}>
      ✦ Django
    </span>
  );
}
