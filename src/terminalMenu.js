const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const API_URL = process.env.API_URL || 'http://127.0.0.1:3000';

async function requestJson(path, payload) {
    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message = data.error || 'Erro na requisição.';
            throw new Error(message);
        }

        return data;
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Não foi possível conectar ao servidor. Inicie o backend com npm start.');
        }
        throw error;
    }
}

async function promptText(rl, message) {
    const answer = await rl.question(message);
    return answer.trim();
}

async function main() {
    const rl = readline.createInterface({ input, output });

    console.log('=== MENU DE AUTENTICAÇÃO ===');
    console.log('1 - Cadastrar usuário');
    console.log('2 - Fazer login');
    console.log('3 - Sair');

    const choice = await promptText(rl, 'Escolha uma opção: ');

    try {
        if (choice === '1') {
            const name = await promptText(rl, 'Nome: ');
            const email = await promptText(rl, 'E-mail: ');
            const password = await promptText(rl, 'Senha: ');
            const cpf = await promptText(rl, 'CPF: ');
            const telefone = await promptText(rl, 'Telefone: ');
            const endereco = await promptText(rl, 'Endereço: ');
            const bairro = await promptText(rl, 'Bairro: ');
            const cidade = await promptText(rl, 'Cidade: ');
            const estado = await promptText(rl, 'Estado: ');
            const cep = await promptText(rl, 'CEP: ');
            const numero = await promptText(rl, 'Número: ');
            const complemento = await promptText(rl, 'Complemento: ');

            const result = await requestJson('/api/register', {
                name,
                email,
                password,
                cpf,
                telefone,
                endereco,
                bairro,
                cidade,
                estado,
                cep,
                numero,
                complemento,
            });
            console.log('\n✅ Cadastro realizado com sucesso!');
            console.log(JSON.stringify(result, null, 2));
        } else if (choice === '2') {
            const email = await promptText(rl, 'E-mail: ');
            const password = await promptText(rl, 'Senha: ');

            const result = await requestJson('/api/login', { email, password });
            console.log('\n✅ Login realizado com sucesso!');
            console.log(JSON.stringify(result, null, 2));
        } else if (choice === '3') {
            console.log('Encerrando...');
        } else {
            console.log('Opção inválida.');
        }
    } catch (error) {
        console.error('\n❌ Erro:', error.message);
    } finally {
        rl.close();
    }
}

main();
