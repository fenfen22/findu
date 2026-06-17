// app/api/universities/route.js
import { supabase } from '@/lib/supabase';
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  const { data, error } = await supabase
    .from('universities')
    .select('*');

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const filtered = data.filter(uni => {
    const matchesUni = uni.name.toLowerCase().includes(search.toLowerCase());
    const majorsArray = Array.isArray(uni.majors) ? uni.majors : [];
    const matchesMajor = majorsArray.some(major => 
      major.title?.toLowerCase().includes(search.toLowerCase())
    );
    return matchesUni || matchesMajor;
  });

  return Response.json(filtered);
}