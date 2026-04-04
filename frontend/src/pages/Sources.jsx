export default function Sources() {
  const sources = [
    {
      citation: 'Meyers, Dan. "Farm." Unsplash, 14 June, 2019.',
      url: 'https://unsplash.com/photos/grass-field-IQVFVH0ajag',
    },
  ];
  return (
    <div className="page">
      <h1 className="page-title">Sources</h1>
      {sources.map((s, i) => (
        <div className="source-item" key={i}>
          {s.citation}{' '}
          <a href={s.url} target="_blank" rel="noreferrer">{s.url}</a>
        </div>
      ))}
    </div>
  );
}
