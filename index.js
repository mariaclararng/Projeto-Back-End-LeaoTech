// index.js
const express = require("express");
const cors = require("cors");

require("dotenv").config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const { createClient } = require("@supabase/supabase-js");
console.log(SUPABASE_URL);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const apiRoutes = require("./src/routes/apiRoutes");

const app = express();

// Integração
app.use(cors());
app.use(express.json());

// API para ligar
app.use("/api", apiRoutes);
const formatProduct = (data) => ({
  id: data.id,
  category: data.category,
  name: data.name,
  price: data.price,
  image: data.image,
  discount: data.discount,
  discountAmount: data.discount_amount,
  productDetails: {
    brand: data.brand,
    shortName: data.short_name,
    ref: data.ref,
    rating: data.rating,
    reviews: data.reviews_count,
    description: data.description,
    images: data.images,
    availableSizes: data.available_sizes,
    availableColors: data.available_colors,
  },
});
app.get("/", (req, res) => {
  res.status(200).json({ message: "Servidor rodando perfeitamente!" });
});
app.get("/listarproducts", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data.map(formatProduct));
});
app.get("/buscarproduct/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ erro: "Produto não encontrado" });

  res.json(formatProduct(data));
});
app.get("/buscarproducts", async (req, res) => {
  const { term } = req.query;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("name", `%${term}%`);

  if (error) return res.status(400).json({ erro: error.message });

  res.json(data.map(formatProduct));
});
app.get('/api/cart/:userId', async (req, res) => {
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
});

app.post('/api/cart/add', async (req, res) => {
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
  res.status(200).json({ message: "Item adicionado com sucesso" });
});

app.put('/api/cart/item/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (quantity <= 0) return res.status(400).json({ erro: "Quantidade inválida" });
  
  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', id);
  if (error) return res.status(400).json({ erro: error.message });
  res.status(200).json({ message: "Quantidade atualizada" });
});

app.delete('/api/cart/item/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) return res.status(400).json({ erro: error.message });
  res.status(200).json({ message: "Item removido" });
});

app.delete('/api/cart/clear/:userId', async (req, res) => {
  const { userId } = req.params;
  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).eq('status', 'ativo').single();
  if (!cart) return res.status(400).json({ erro: "Carrinho não encontrado" });

  const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
  if (error) return res.status(400).json({ erro: error.message });
  res.status(200).json({ message: "Carrinho esvaziado" });
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor ativo com carinho na porta ${PORT}`);
});
