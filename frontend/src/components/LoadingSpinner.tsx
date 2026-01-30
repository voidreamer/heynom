interface LoadingSpinnerProps {
  text?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ text, fullPage = true }: LoadingSpinnerProps) {
  const content = (
    <>
      <div className="spinner" />
      {text && <p style={{ marginTop: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '1rem' }}>{text}</p>}
    </>
  );

  if (fullPage) {
    return <div className="loading">{content}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
      {content}
    </div>
  );
}
