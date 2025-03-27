export default function Home() {
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  };

  const welcomeMessageStyle = {
    fontSize: '24px',
    color: '#333',
  };

  return (
      <div style={containerStyle}>
        <div style={welcomeMessageStyle}>Hello and welcome to my main page!</div>
      </div>
  );
}