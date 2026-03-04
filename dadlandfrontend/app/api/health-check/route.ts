import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Tenta bater no backend. 
        // No Docker, a comunicação servidor-servidor (Next -> Django) usa a rede interna.
        // Adicionamos o INTERNAL_BACKEND_URL como primeira opção.
        const backendUrl = process.env.INTERNAL_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        // Faz a requisição desativando o cache agressivo do Next.js
        // Isso obriga o Next.js a checar o backend em tempo real toda vez que a rota for acessada
        const res = await fetch(`${backendUrl}/api/health-check/`, {
            cache: 'no-store'
        });

        // Extrai o JSON de resposta que veio lá do Django
        const backendData = await res.json();

        // Se o Django respondeu, repassamos os dados dele
        return NextResponse.json({
            frontend: 'up',
            backend_connection: res.ok ? 'up' : 'down',
            backend_status: backendData,
            timestamp: new Date().toISOString()
        }, { status: res.ok ? 200 : 502 }); // 502 Bad Gateway se o Django estiver de pé, mas com banco caído

    } catch (error) {
        // Cai aqui no Catch se o servidor do Django estiver TOTALMENTE offline (conexão recusada)
        return NextResponse.json({
            frontend: 'up',
            backend_connection: 'down',
            error: 'Failed to connect to backend'
        }, { status: 503 }); // 503 Service Unavailable
    }
}