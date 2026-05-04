// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Obtenemos los agentes de la base de datos para mostrarlos en un <select>
    const { data: agents } = await supabase.from('agents').select('id, name');

    // --- SERVER ACTION ---
    // Esta función se ejecuta exclusivamente en el servidor cuando se envía el formulario
    const addProperty = async (formData: FormData) => {
        'use server';

        // 1. Instanciamos el cliente de nuevo dentro de la acción por seguridad
        const supabaseAction = await createClient();

        // 2. Extraemos y formateamos los datos del formulario
        const newProperty = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: Number(formData.get('price')),
            location: formData.get('location') as string,
            type: formData.get('type') as string,
            image_url: formData.get('image_url') as string || null,
            agent_id: formData.get('agent_id') as string,
        };

        // 3. Insertamos en la tabla de Supabase
        const { error } = await supabaseAction.from('properties').insert([newProperty]);

        if (error) {
            console.error('Error al insertar:', error);
            // En un entorno real, aquí manejaríamos el error visualmente
            return;
        }

        // 4. Magia de Next.js: Limpiamos la caché de la página principal para que 
        // la nueva propiedad aparezca instantáneamente en el catálogo
        revalidatePath('/');

        // 5. Redirigimos al usuario al catálogo para ver su publicación
        redirect('/');
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Sesión iniciada como: <span className="font-semibold text-blue-600">{user.email}</span>
                        </p>
                    </div>

                    <form action={async () => {
                        'use server';
                        const supabase = await createClient();
                        await supabase.auth.signOut();
                        redirect('/login');
                    }}>
                        <button className="text-red-600 font-medium hover:underline text-sm">
                            Cerrar Sesión
                        </button>
                    </form>
                </header>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-gray-600">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Publicar Nueva Propiedad</h2>

                    {/* Conectamos el formulario al Server Action */}
                    <form action={addProperty} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Título de la publicación</label>
                                <input type="text" name="title" required placeholder="Ej: Casa Minimalista con Pileta" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Inmueble</label>
                                <select name="type" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                    <option value="Casa">Casa</option>
                                    <option value="Departamento">Departamento</option>
                                    <option value="Terreno">Terreno</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
                                <select name="location" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                    <option value="Salta Capital">Salta Capital</option>
                                    <option value="San Lorenzo">San Lorenzo</option>
                                    <option value="Palpalá, Jujuy">Palpalá, Jujuy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Precio (US$)</label>
                                <input type="number" name="price" required min="0" placeholder="Ej: 150000" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Agente Asignado</label>
                                <select name="agent_id" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                    <option value="">Seleccione un agente...</option>
                                    {agents?.map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">URL de la Imagen</label>
                                <input type="url" name="image_url" placeholder="https://ejemplo.com/imagen.jpg" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                                <textarea name="description" required rows={4} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe los detalles principales..."></textarea>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-8">
                            Publicar Propiedad
                        </button>

                    </form>
                </div>
            </div>
        </main>
    );
}