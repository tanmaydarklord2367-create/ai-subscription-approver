export default function Logo({ size = 28, light = false }) {
  return (
    <span style={{
      fontFamily: "'Bebas Neue', Impact, 'Arial Black', sans-serif",
      fontSize: size,
      letterSpacing: '0.08em',
      color: light ? '#111' : 'white',
      display: 'inline-flex',
      alignItems: 'baseline',
      userSelect: 'none',
      lineHeight: 1,
    }}>
      DJAN
      <span style={{ position: 'relative', display: 'inline-block' }}>
        G
        <span style={{
          position: 'absolute',
          top: '22%',
          right: '8%',
          width: '32%',
          height: '32%',
          background: '#FF4500',
          borderRadius: 2,
        }} />
      </span>
      O
    </span>
  );
}
