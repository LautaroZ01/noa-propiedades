// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = await createClient();

    // Obtenemos el usuario activo
    const { data: { user } } = await supabase.auth.getUser();

    // Doble check de seguridad (aunque el middleware ya lo protege)
    if (!user) {
        redirect('/login');
    }

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
                        <p className="text-gray-500 text-sm mt-1">Sesión iniciada como: <span className="font-semibold text-blue-600">{user.email}</span></p>
                    </div>

                    {/* Botón de cierre de sesión rápido */}
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

                {/* Aquí insertaremos el formulario en el siguiente paso */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-gray-400">Espacio reservado para el formulario de carga...</h2>
                </div>
            </div>
        </main>
    );
}