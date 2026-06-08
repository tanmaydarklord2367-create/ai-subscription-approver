export default function Logo({ size = 28, light = false }) {
  return (
    <span style={{
      fontSize: size,
      fontWeight: 800,
      background: light
        ? 'linear-gradient(135deg, #FF4500, #FF8C00)'
        : 'linear-gradient(135deg, #FFFFFF, #FF6B00)',
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
