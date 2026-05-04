// app/login/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default function LoginPage() {

    // Esto es un SERVER ACTION: Se ejecuta 100% en el servidor de Node.js
    const login = async (formData: FormData) => {
        'use server'; // Directiva obligatoria

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const supabase = await createClient();

        // Intentamos iniciar sesión con Supabase
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Si falla, volvemos a la página de login (puedes atrapar este parámetro para mostrar un error visual)
            return redirect('/login?error=Credenciales+inválidas');
        }

        // Si es exitoso, lo enviamos a la ruta protegida
        return redirect('/dashboard');
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
                <h1 className="text-2xl font-black text-gray-900 mb-2 text-center">Acceso Agentes</h1>
                <p className="text-gray-500 text-center mb-8 text-sm">Ingresa a tu panel de gestión PropTech</p>

                {/* Conectamos el formulario al Server Action usando 'action=' */}
                <form action={login} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </main>
    );
}