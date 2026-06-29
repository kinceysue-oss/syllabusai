export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 });
  }

  return Response.json({ 
    message: 'File received',
    filename: file.name,
    size: file.size
  });
}