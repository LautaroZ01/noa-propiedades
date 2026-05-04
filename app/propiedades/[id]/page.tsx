// app/propiedades/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

// Definimos los tipos de los parámetros que recibe la página
export default async function PropertyDetail({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // En las versiones modernas de Next.js, 'params' es una Promesa que debemos resolver
    const { id } = await params;

    // Instanciamos el cliente
    const supabase = await createClient();

    // Hacemos la consulta a Supabase filtrando por el ID de la URL (.eq)
    // y pedimos que devuelva un solo objeto (.single) en lugar de un array
    const { data: property, error } = await supabase
        .from('properties')
        .select(`
      *,
      agents ( name, email, phone )
    `)
        .eq('id', id)
        .single();

    if (error || !property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h1>
                <Link href="/" className="text-blue-600 hover:underline">Volver al catálogo</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">

                {/* Botón para volver */}
                <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
                    ← Volver al catálogo
                </Link>

                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Imagen de cabecera */}
                    <div className="h-96 w-full bg-gray-200">
                        {property.image_url ? (
                            <img
                                src={property.image_url}
                                alt={property.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                        )}
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                            <div>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-3">
                                    {property.type} en {property.location}
                                </span>
                                <h1 className="text-3xl font-extrabold text-gray-900">{property.title}</h1>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-sm text-gray-500 mb-1">Precio de Venta</p>
                                <p className="text-4xl font-black text-gray-900">US$ {property.price.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {property.description}
                            </p>
                        </div>

                        {/* Tarjeta del Agente Inmobiliario */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Agente a cargo</p>
                                <p className="text-xl font-bold text-gray-900">{property.agents?.name}</p>
                                <div className="text-gray-600 text-sm mt-1">
                                    <p>✉️ {property.agents?.email}</p>
                                    <p>📱 {property.agents?.phone}</p>
                                </div>
                            </div>
                            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                Contactar Agente
                            </button>
                        </div>

                    </div>
                </article>
            </div>
        </main>
    );
}