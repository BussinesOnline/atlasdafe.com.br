export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://atlasdafe.com.br');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { name, email } = req.body;

    if (!name || !email || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ error: 'Nome e e-mail válidos são obrigatórios.' });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Configuração do servidor inválida.' });
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                email: email.trim().toLowerCase(),
                attributes: {
                    FIRSTNAME: name.trim(),
                },
                listIds: [2],
                updateEnabled: true,
            }),
        });

        if (response.ok || response.status === 204) {
            return res.status(200).json({ success: true });
        }

        const data = await response.json();

        // Contato já existe — trata como sucesso para não expor info ao usuário
        if (data.code === 'duplicate_parameter') {
            return res.status(200).json({ success: true });
        }

        return res.status(500).json({ error: 'Não foi possível concluir o cadastro.' });
    } catch {
        return res.status(500).json({ error: 'Erro de conexão. Tente novamente.' });
    }
}
