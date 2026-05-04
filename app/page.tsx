// app/page.tsx
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      *,
      agents ( name )
    `);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-bold">Error al cargar datos: {error.message}</p>
      </div>
    );
  }

  if (!properties) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-red-500 font-bold">Error al cargar datos</p>
    </div>
  )

  console.log(properties)

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">NOA Propiedades</h1>
          <p className="text-gray-600 mt-2 text-lg">Las mejores oportunidades en Salta y Jujuy</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <article
              key={property.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="h-56 overflow-hidden bg-gray-200">
                {property.image_url ? (
                  /* Usamos la etiqueta img nativa temporalmente */
                  <img
                    src={property.image_url}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                )}
              </div>

              <div className="p-6">
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
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}