async function run() {
  const loginRes = await fetch('http://127.0.0.1:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@locify.co', password: 'Password123!' })
  });
  const loginData = await loginRes.json();
  console.log('Admin login:', loginRes.status);
  
  if (loginData.token) {
    const activasRes = await fetch('http://127.0.0.1:3001/api/operador/reservas-activas?sedeId=sede-centro', {
      headers: { 'Authorization': 'Bearer ' + loginData.token }
    });
    console.log('Reservas activas with ADMIN:', activasRes.status);
    console.log(await activasRes.json());
  }
}
run().catch(console.error);