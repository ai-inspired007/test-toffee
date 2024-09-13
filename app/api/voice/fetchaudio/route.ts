import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const response = await fetch(url as string);
    const data = await response.blob();
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'audio/mpeg');
    res.send(await data.arrayBuffer());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the resource" });
  }
}