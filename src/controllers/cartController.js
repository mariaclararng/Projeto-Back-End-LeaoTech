require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const getCart = async (req, res) => {
  const { userId } = req.params;
  let { data: cart, error: cartError } = await supabase.from('carts').select('id').eq('user_id', userId).eq('status', 'ativo').single();
  
  if (cartError && cartError.code !== 'PGRST116') return res.status(400).json({ erro: cartError.message });
  if (!cart) return res.json({ cartId: null, items: [] });

  const { data: items, error: itemsError } = await supabase
    .from('cart_items')
    .select(`id, quantity, price_at_addition, products (id, name, price, image, category, discount, discount_amount)`)
    .eq('cart_id', cart.id)
    .order('created_at', { ascending: true });

  if (itemsError) return res.status(400).json({ erro: itemsError.message });
  res.json({ cartId: cart.id, items });
};

const addToCart = async (req, res) => {
  const { userId, productId, quantity, price } = req.body;
  let { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).eq('status', 'ativo').single();

  if (!cart) {
    const { data: newCart, error: createError } = await supabase.from('carts').insert([{ user_id: userId, status: 'ativo' }]).select('id').single();
    if (createError) return res.status(400).json({ erro: createError.message });
    cart = newCart;
  }

  const { data: existingItem } = await supabase.from('cart_items').select('id, quantity').eq('cart_id', cart.id).eq('product_id', productId).single();

  if (existingItem) {
    const { error: updateError } = await supabase.from('cart_items').update({ quantity: existingItem.quantity + quantity }).eq('id', existingItem.id);
    if (updateError) return res.status(400).json({ erro: updateError.message });
  } else {
    const { error: insertError } = await supabase.from('cart_items').insert([{ cart_id: cart.id, product_id: productId, quantity, price_at_addition: price }]);
    if (insertError) return res.status(400).json({ erro: insertError.message });
  }
  res.status(200).json({ message: "Item adicionado" });
};

const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (quantity <= 0) return res.status(400).json({ erro: "Quantidade inválida" });
  
  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', id);
  if (error) return res.status(400).json({ erro: error.message });
  res.status(200).json({ message: "Atualizado" });
};

const removeCartItem = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) return res.status(400).json({ erro: error.message });
  res.status(200).json({ message: "Removido" });
};

const clearCart = async (req, res) => {
  const { userId } = req.params;
  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).eq('status', 'ativo').single();
  if (!cart) return res.status(400).json({ erro: "Carrinho não encontrado" });

  const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
  if (error) return res.status(400).json({ erro: error.message });
  res.status(200).json({ message: "Esvaziado" });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };