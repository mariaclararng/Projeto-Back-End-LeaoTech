require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const rawSupabaseUrl = process.env.SUPABASE_PROJECT_URL || process.env.SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl
  .replace(/\/(rest|auth|storage)\/v1\/?$/, '')
  .replace(/\/$/, '');
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('As variáveis SUPABASE_PROJECT_URL/SUPABASE_URL e SUPABASE_KEY/SUPABASE_SERVICE_ROLE_KEY precisam estar definidas.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const register = async (req, res) => {
  try {
    const {
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
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const normalizedCpf = cpf ? cpf.replace(/\D/g, '') : '';
    const normalizedTelefone = telefone ? telefone.replace(/\D/g, '') : '';
    const normalizedCep = cep ? cep.replace(/\D/g, '') : '';

    const { data, error } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        name: name.trim(),
        cpf: normalizedCpf,
        telefone: normalizedTelefone,
        endereco: endereco?.trim() || '',
        bairro: bairro?.trim() || '',
        cidade: cidade?.trim() || '',
        estado: estado?.trim() || '',
        cep: normalizedCep,
        numero: numero?.trim() || '',
        complemento: complemento?.trim() || '',
      },
    });

    if (error) {
      const message = error.message || 'Erro ao cadastrar usuário.';
      const statusCode = message.includes('already') ? 409 : 400;
      return res.status(statusCode).json({ error: message });
    }

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso no Supabase!',
      user: data.user,
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário no Supabase:', error);
    return res.status(500).json({ error: error.message || 'Erro ao cadastrar usuário no Supabase.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: data.user,
      accessToken: data.session?.access_token,
    });
  } catch (error) {
    console.error('Erro ao realizar login no Supabase:', error);
    return res.status(500).json({ error: error.message || 'Erro ao realizar login no Supabase.' });
  }
};

module.exports = { register, login };