// app/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import SearchFilter from './components/SearchFilter'; // Importamos el nuevo componente

export default async function Home({
  searchParams,
}: {
  // En versiones recientes de Next.js, searchParams es una Promesa
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { ubicacion } = await searchParams;
  const supabase = await createClient();

  // 1. Iniciamos la consulta base
  let query = supabase
    .from('properties')
    .select(`*, agents ( name )`);

  // 2. Si hay un filtro en la URL, le agregamos la condición a Supabase
  if (ubicacion) {
    query = query.ilike('location', `%${ubicacion}%`); // ilike ignora mayúsculas/minúsculas
  }

  // 3. Ejecutamos la consulta
  const { data: properties, error } = await query;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-bold">Error al cargar datos: {error.message}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">NOA Propiedades</h1>
          <p className="text-gray-600 mt-2 text-lg">Las mejores oportunidades en Salta y Jujuy</p>
        </header>

        {/* Insertamos el componente de cliente aquí */}
        <SearchFilter />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties?.map((property) => (
            <article
              key={property.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="h-56 overflow-hidden bg-gray-200">
                {property.image_url ? (
                  <img
                    src={property.image_url}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                )}
              </div>

              <div className="p-6 grow">
                <div className="uppercase tracking-wider text-xs text-blue-600 font-bold mb-2">
                  {property.type} • {property.location}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                  {property.title}
                </h2>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">
                  {property.description}
                </p>

                <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Precio</p>
                    <span className="text-2xl font-black text-gray-900">
                      US$ {property.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Agente</p>
                    <span className="text-sm font-medium text-gray-700">
                      {property.agents?.name || 'No asignado'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Link
                  href={`/propiedades/${property.id}`}
                  className="block w-full text-center bg-blue-100 text-blue-700 font-semibold py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Ver Detalles
                </Link>
              </div>
            </article>
          ))}

          {/* Mensaje si no hay resultados */}
          {properties?.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No se encontraron propiedades en esta ubicación.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}