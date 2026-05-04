'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        const value = e.target.value;

        if (value) {
            params.set('ubicacion', value);
        } else {
            params.delete('ubicacion');
        }

        // Actualizamos la URL sin recargar la página entera
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <label htmlFor="ubicacion" className="font-semibold text-gray-700">
                Filtrar por ubicación:
            </label>
            <select
                id="ubicacion"
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleFilter}
                defaultValue={searchParams.get('ubicacion') || ''}
            >
                <option value="">Todas las ubicaciones</option>
                <option value="Salta Capital">Salta Capital</option>
                <option value="San Lorenzo">San Lorenzo</option>
                <option value="Palpalá">Palpalá, Jujuy</option>
            </select>
        </div>
    );
}