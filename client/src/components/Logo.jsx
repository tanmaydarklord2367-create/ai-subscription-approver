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
          bottom: '10%',
          right: '-8%',
          width: '38%',
          height: '38%',
          background: '#FF4500',
          borderRadius: 2,
        }} />
      </span>
      O
    </span>
  );
}
