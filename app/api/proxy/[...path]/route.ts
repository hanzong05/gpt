// app/api/proxy/[...path]/route.ts
const API_BASE = 'https://aimddlwr-git-main-hanz-pillervas-projects.vercel.app/';

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const body = await request.text();
  
  const response = await fetch(`${API_BASE}/api/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(request.headers.get('authorization') && {
        Authorization: request.headers.get('authorization')!
      })
    },
    body,
  });

  const data = await response.text();
  
  return new Response(data, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  
  const response = await fetch(`${API_BASE}/api/${path}`, {
    method: 'GET',
    headers: {
      ...(request.headers.get('authorization') && {
        Authorization: request.headers.get('authorization')!
      })
    },
  });

  const data = await response.text();
  
  return new Response(data, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}